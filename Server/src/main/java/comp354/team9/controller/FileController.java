package comp354.team9.controller;

import comp354.team9.model.User;
import comp354.team9.model.UserDeck;
import comp354.team9.payload.UploadFileResponse;
import comp354.team9.repository.UserDeckRepository;
import comp354.team9.repository.UserRepository;
import comp354.team9.security.CurrentUser;
import comp354.team9.security.UserPrincipal;
import comp354.team9.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDeckRepository userDeckRepository;

    @PostMapping("/api/uploadFile")
    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file, @CurrentUser UserPrincipal currentUser) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        String cardlist = fileStorageService.processDeckFile(file);
        User user = userRepository.findById(currentUser.getId()).get();
        UserDeck deck = new UserDeck(user, fileName.substring(0, fileName.length() - 4), cardlist);

        userDeckRepository.save(deck);

        if (user.getDefaultDeck() == null) {
            user.setDefaultDeck(deck);
            userRepository.save(user);
        }

        return new UploadFileResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }


    @GetMapping("/api/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
