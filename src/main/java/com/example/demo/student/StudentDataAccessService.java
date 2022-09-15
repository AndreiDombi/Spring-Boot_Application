package com.example.demo.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Repository
public class StudentDataAccessService {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public StudentDataAccessService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    List<Student> selectAllStudents() {
        @SuppressWarnings("SqlNoDataSourceInspection")
        String sql = "SELECT student_id, " +
                "first_name, " +
                "last_name, " +
                "email, " +
                "gender " +
                "FROM student";
        return jdbcTemplate.query(sql, mapStudentsFromDb());
    }

    int insertStudent(UUID studentId, Student student) {
        @SuppressWarnings("SqlNoDataSourceInspection")
        String sql = "" +
                "INSERT INTO student (" +
                " student_id, " +
                " first_name, " +
                " last_name, " +
                " email, " +
                " gender) "+
                " VALUES (?, ?, ?, ?, ?::gender)";
        return jdbcTemplate.update(
                sql,
                studentId,
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getGender().name().toUpperCase());
    }

    private static RowMapper<Student> mapStudentsFromDb() {
        return (resultSet, i) -> {
            String studentIdStr = resultSet.getString("student_id");
            UUID studentId = UUID.fromString(studentIdStr);
            String firstName = resultSet.getString("first_name");
            String lastName = resultSet.getString("last_name");
            String email = resultSet.getString("email");
            String genderStr = resultSet.getString("gender").toUpperCase(Locale.ROOT);
            Student.Gender gender = Student.Gender.valueOf(genderStr);
            return new Student(studentId, firstName, lastName, email, gender);
        };
    }
    @SuppressWarnings("ConstantConditions")
    boolean isEmailTaken(String email) {
        @SuppressWarnings("SqlNoDataSourceInspection")
        String sql = "" +
                "SELECT EXISTS ( " +
                " SELECT 1 " +
                " FROM student " +
                " WHERE email = ?" +
                " )";
        return jdbcTemplate.queryForObject(
                sql,
                new Object[] {email},
                (resultSet, i) ->resultSet.getBoolean(1)
        );
    }
}
