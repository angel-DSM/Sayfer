package com.sayfer.sayfer.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigoRecuperacion(String correoDestino, String codigo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom("diego.aguerreros.trabajo@gmail.com");
        mensaje.setTo(correoDestino);
        mensaje.setSubject("Recuperación de contraseña - SAYFER");
        mensaje.setText(
            "Hola,\n\n" +
            "Tu código de recuperación de contraseña es:\n\n" +
            "  " + codigo + "\n\n" +
            "Este código es válido por 10 minutos.\n" +
            "Si no solicitaste esto, ignora este correo.\n\n" +
            "— Sistema SAYFER"
        );
        mailSender.send(mensaje);
    }
}
