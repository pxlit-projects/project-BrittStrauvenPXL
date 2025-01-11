package be.pxl.services.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class Review implements Serializable {
    private long id;
    private long postId;
    private String reviewMessage;
    private boolean approved;
}
