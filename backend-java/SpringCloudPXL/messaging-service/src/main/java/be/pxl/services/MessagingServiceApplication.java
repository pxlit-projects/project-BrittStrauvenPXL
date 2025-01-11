package be.pxl.services;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.amqp.rabbit.core.RabbitAdmin;

@SpringBootApplication
@EnableDiscoveryClient
public class MessagingServiceApplication
{
    private final RabbitAdmin rabbitAdmin;

    public MessagingServiceApplication(RabbitAdmin rabbitAdmin) {
        this.rabbitAdmin = rabbitAdmin;
    }

    public static void main( String[] args )
    {
        SpringApplication.run(MessagingServiceApplication.class, args);

    }

    @PostConstruct
    public void init() {
        rabbitAdmin.initialize();
    }
}
