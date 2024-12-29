package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBudgetExceededEmail(String toEmail, String budgetName, double currentAmount, double limit) {
        String subject = "Budget Exceeded Alert: " + budgetName;
        String message = "Dear User,\n\nYour budget for \"" + budgetName + "\" has been exceeded.\n" +
                "Current Spending: $" + currentAmount + "\n" +
                "Budget Limit: $" + limit + "\n\n" +
                "Please review your expenses.\n\n" +
                "Thank you,\nBudget Tracker App";

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }
}

