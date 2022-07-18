package com.awsaylot.videochat.controllers;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;

import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.awsaylot.videochat.entities.ERole;
import com.awsaylot.videochat.entities.Role;
import com.awsaylot.videochat.entities.User;
import com.awsaylot.videochat.payload.request.LoginRequest;
import com.awsaylot.videochat.payload.request.SignupRequest;
import com.awsaylot.videochat.payload.response.JwtResponse;
import com.awsaylot.videochat.payload.response.MessageResponse;
import com.awsaylot.videochat.repository.RoleRepository;
import com.awsaylot.videochat.repository.UserRepository;
import com.awsaylot.videochat.security.jwt.JwtUtils;
import com.awsaylot.videochat.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  MessageSource messages;

  @Autowired
  JavaMailSender mailSender;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws MessagingException, UnsupportedEncodingException {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    roles.add(userRole);

//    if (strRoles == null) {
//      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//      roles.add(userRole);
//    } else {
//      strRoles.forEach(role -> {
//        switch (role) {
//        case "admin":
//          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
//              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//          roles.add(adminRole);
//
//          break;
//        default:
//          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//          roles.add(userRole);
//        }
//      });
//    }

    String randomCode = RandomString.make(64);
    user.setVerificationCode(randomCode);
    user.setEnabled(false);


    user.setRoles(roles);
    userRepository.save(user);
    sendVerificationEmail(user, "http://localhost:8080/api/auth");

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @GetMapping("/verify")
  public String verifyUser(@Param("code") String code) {
    if (verify(code)) {
      return "verify_success";
    } else {
      return "verify_fail";
    }
  }

  public boolean verify(String verificationCode) {
    User user = userRepository.findByVerificationCode(verificationCode)
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
    if (user == null || user.isEnabled()) {
      return false;
    } else {
      user.setVerificationCode(null);
      user.setEnabled(true);
      userRepository.save(user);
      return true;
    }
  }
  private void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
    String toAddress = user.getEmail();
    String fromAddress = "admin@webchat.com";
    String senderName = "Webchat";
    String subject = "Please verify registration";
    String content = "Dear [[name]],<br>"
            + "Please click the link below to verify your registration:<br>"
            + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
            + "Thank you,<br>"
            + "Webchat";

    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message);

    helper.setFrom(fromAddress, senderName);
    helper.setTo(toAddress);
    helper.setSubject(subject);

    content = content.replace("[[name]]", user.getUsername());
    String verifyURL = siteURL + "/verify?code=" + user.getVerificationCode();
    content = content.replace("[[URL]]", verifyURL);
    helper.setText(content, true);
    mailSender.send(message);
  }
}
