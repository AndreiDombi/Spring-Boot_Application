package com.example.demo.student;

import com.example.demo.exception.ApiRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("students")
public class StudentController {
    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        //throw new ApiRequestException("Cannot get all students with custom exception. ");
        //throw new IllegalStateException("Cannot get all students");
        return studentService.getAllStudents();
    }
    @PostMapping
    public void addNewStudent(@RequestBody Student student) {
        studentService.addNewStudent( student);
    }
}
