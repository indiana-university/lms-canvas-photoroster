package edu.iu.uits.lms.photoroster.security;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by chmaurer on 12/12/14.
 */
@Data
public class SessionUser implements Serializable {
    private String username;
    private String courseId;
    private String canvasUserId;
    private List<String> usersInCourse = new ArrayList<String>();

}
