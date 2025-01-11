package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    private String author;
    private LocalDate creationDate;
    @Enumerated(EnumType.STRING)
    private PostStatus status;

}
