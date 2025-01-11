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
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long postId;
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    private String commenter;
    private LocalDate creationDate;
}
