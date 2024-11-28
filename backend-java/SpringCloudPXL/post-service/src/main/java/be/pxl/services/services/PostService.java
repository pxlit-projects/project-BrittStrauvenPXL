package be.pxl.services.services;

import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public void createNewPost(CreatePostRequest request) {
        Post post = new Post();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setAuthor(request.author());
        post.setCreationDate(LocalDate.now());
        postRepository.save(post);
    }
}
