package be.pxl.services.services;

import be.pxl.services.api.dto.PostDto;
import be.pxl.services.api.request.CreatePostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.converter.PostConverter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostConverter postConverter;

    public PostService(PostRepository postRepository, PostConverter postConverter) {
        this.postRepository = postRepository;
        this.postConverter = postConverter;
    }

    public void createNewPost(CreatePostRequest request) {
        Post post = new Post();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setAuthor(request.author());
        post.setCreationDate(LocalDate.now());
        post.setConcept(request.isConcept());
        postRepository.save(post);
    }

    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(postConverter::convert)
                .toList();
    }

    public void editPost(long id, CreatePostRequest request) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setConcept(request.isConcept());
        postRepository.save(post);
    }

    public PostDto getPostById(long id) {
        return postRepository.findById(id)
                .map(postConverter::convert)
                .orElseThrow();
    }
}
