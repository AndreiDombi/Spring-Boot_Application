package com.example.demo.student;

import com.example.demo.EmailValidator;
import com.example.demo.exception.ApiRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentDataAccessService studentDataAccessService;
    private final EmailValidator emailValidator;

    @Autowired
    public StudentService(StudentDataAccessService studentDataAccessService, EmailValidator emailValidator) {
        this.studentDataAccessService = studentDataAccessService;
        this.emailValidator = emailValidator;
    }

    List<Student> getAllStudents(){
        return studentDataAccessService.selectAllStudents();
    }

    void addNewStudent(Student student) {
        addNewStudent(null,student);
    }

    void addNewStudent(UUID studentId,Student student) {
        UUID newStudentId = Optional.ofNullable(studentId).orElse(UUID.randomUUID());
        // TODO: verify if email is not taken
        if (studentDataAccessService.isEmailTaken(student.getEmail())) {
            throw new ApiRequestException(student.getEmail() + " is taken");
        }
        if (!emailValidator.test(student.getEmail())) {
            throw  new ApiRequestException(student.getEmail() + " is not valid!");
        }
        studentDataAccessService.insertStudent(newStudentId,student);
    }
}
