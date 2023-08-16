package com.example.backend.controller;
import com.example.backend.model.Question;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/file")
@CrossOrigin("*")
public class QuestionController {


    @PostMapping("/upload")
    public ResponseEntity<List<Question>> getQuestionsFromExcelFile(@RequestParam("file") MultipartFile file){
        List<Question> questions = new ArrayList<>();
        try {
            File newFile = new File(file.getOriginalFilename());
            newFile.createNewFile();
            FileOutputStream fileOutputStream = new FileOutputStream(newFile);
            fileOutputStream.write(file.getBytes());
            fileOutputStream.close();
            FileInputStream fileInputStream = new FileInputStream(newFile);
            Workbook workbook = new XSSFWorkbook(fileInputStream);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                String question = "", answer = "";
                if (row.getCell(0) != null){
                    if (row.getCell(0).getCellType() == CellType.NUMERIC){
                        question = String.valueOf(row.getCell(0).getNumericCellValue());
                    } else {
                        question = row.getCell(0).getStringCellValue();
                    }
                }
                if (row.getCell(1) != null){
                    if (row.getCell(1).getCellType() == CellType.NUMERIC){
                        answer = String.valueOf(row.getCell(1).getNumericCellValue());
                    } else {
                        answer = row.getCell(1).getStringCellValue();
                    }
                }
                System.out.println(question);
                System.out.println(answer);
                questions.add(new Question(question, answer));
            }
            newFile.delete();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(questions);
    }
}
