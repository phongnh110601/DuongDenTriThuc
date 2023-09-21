package com.phongnh.ddtt.controller;
import com.phongnh.ddtt.model.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
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

    private static final String STATIC_FOLDER = "src/main/resources/static/";

    @PostMapping("/media-upload")
    public void uploadMedia(@RequestParam("files") MultipartFile[] files){
        try{
            for (MultipartFile file: files){
                File newFile = new File(STATIC_FOLDER + file.getOriginalFilename());
                newFile.createNewFile();
                FileOutputStream fileOutputStream = new FileOutputStream(newFile);
                fileOutputStream.write(file.getBytes());
                fileOutputStream.close();
            }
        } catch (Exception e){
            System.out.println(e);
        }
    }

    @PostMapping("/excel-upload")
    public ResponseEntity<Game> getQuestionsFromExcelFile(@RequestParam("file") MultipartFile file){
        Game game = new Game();
        try {
            File newFile = new File(STATIC_FOLDER + file.getOriginalFilename());
            newFile.createNewFile();
            FileOutputStream fileOutputStream = new FileOutputStream(newFile);
            fileOutputStream.write(file.getBytes());
            fileOutputStream.close();
            FileInputStream fileInputStream = new FileInputStream(newFile);
            Workbook workbook = new XSSFWorkbook(fileInputStream);
            Sheet startSheet = workbook.getSheetAt(0);
            Sheet obstacleSheet = workbook.getSheetAt(1);
            Sheet accelerationSheet = workbook.getSheetAt(2);
            Sheet finishSheet = workbook.getSheetAt(3);
            Sheet extraSheet = workbook.getSheetAt(4);
            game.setStartQuestions(getStartQuestions(startSheet));
            game.setObstacle(getObstacle(obstacleSheet));
            game.setAccelerationQuestions(getAccelerationQuestion(accelerationSheet));
            game.setFinishQuestions(getFinishQuestion(finishSheet));
            game.setExtraQuestions(getExtraQuestion(extraSheet));
            newFile.delete();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(game);
    }

    private List<StartQuestion> getStartQuestions(Sheet sheet){
        List<StartQuestion> startQuestions = new ArrayList<>();
        for (int i = 1; i <= 36; i++) {
            Row row = sheet.getRow(i);
            String question = row.getCell(0).getStringCellValue();
            String answer = row.getCell(1).getStringCellValue();
            int score = (int)row.getCell(2).getNumericCellValue();
            String image = row.getCell(3).getStringCellValue();
            String audio = row.getCell(4).getStringCellValue();
            String video = row.getCell(5).getStringCellValue();
            int packageIndex = (int)row.getCell(6).getNumericCellValue();
            int index = (int)row.getCell(7).getNumericCellValue();
            QuestionType type;
            if (!image.isEmpty()){
                type = QuestionType.IMAGE;
                image = "question/start/" + image;
            } else if (!audio.isEmpty()){
                type = QuestionType.AUDIO;
                audio = "question/start/" + audio;
            } else if (!video.isEmpty()){
                type = QuestionType.VIDEO;
                video = "question/start/" + video;
            } else {
                type = QuestionType.TEXT;
            }
            startQuestions.add(new StartQuestion(question, answer, score, image, audio, video, type, packageIndex, index));

        }
        return startQuestions;
    }

    private Obstacle getObstacle(Sheet sheet){
        List<ObstacleQuestion> questions = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            Row row = sheet.getRow(i);
            String question = row.getCell(0).getStringCellValue();
            String answer = row.getCell(1).getStringCellValue();
            int score = (int)row.getCell(2).getNumericCellValue();
            String image = row.getCell(3).getStringCellValue();
            String audio = row.getCell(4).getStringCellValue();
            String video = row.getCell(5).getStringCellValue();
            QuestionType type;
            if (!image.isEmpty()){
                type = QuestionType.IMAGE;
                image = "question/obstacle/" + image;
            } else if (!audio.isEmpty()){
                type = QuestionType.AUDIO;
                audio = "question/obstacle/" + audio;
            } else if (!video.isEmpty()){
                type = QuestionType.VIDEO;
                video = "question/obstacle/" + video;
            } else {
                type = QuestionType.TEXT;
            }
            questions.add(new ObstacleQuestion(question, answer, score, image, audio, video, type, false, false, false));
        }
        String answer = sheet.getRow(6).getCell(1).getStringCellValue();
        String image = "question/obstacle/" + sheet.getRow(6).getCell(3).getStringCellValue();
        return new Obstacle(questions, answer, image, false);
    }

    private List<Question> getAccelerationQuestion(Sheet sheet){
        List<Question> questions = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            Row row = sheet.getRow(i);
            String question = row.getCell(0).getStringCellValue();
            String answer = row.getCell(1).getStringCellValue();
            int score = (int)row.getCell(2).getNumericCellValue();
            String image = row.getCell(3).getStringCellValue();
            String audio = row.getCell(4).getStringCellValue();
            String video = row.getCell(5).getStringCellValue();
            QuestionType type;
            if (!image.isEmpty()){
                type = QuestionType.IMAGE;
                image = "question/acceleration/" + image;
            } else if (!audio.isEmpty()){
                type = QuestionType.AUDIO;
                audio = "question/acceleration/" + audio;
            } else if (!video.isEmpty()){
                type = QuestionType.VIDEO;
                video = "question/acceleration/" + video;
            } else {
                type = QuestionType.TEXT;
            }

            questions.add(new Question(question, answer, score, image, audio, video, type));
        }
        return questions;
    }

    private FinishQuestion getFinishQuestion(Sheet sheet){
        FinishQuestion finishQuestion = new FinishQuestion();
        List<Question> mediumQuestions = new ArrayList<>();
        List<Question> hardQuestions = new ArrayList<>();
        for (int i = 1; i <= 32; i++) {
            Row row = sheet.getRow(i);
            String question = row.getCell(0).getStringCellValue();
            String answer = row.getCell(1).getStringCellValue();
            int score = (int)row.getCell(2).getNumericCellValue();
            String image = row.getCell(3).getStringCellValue();
            String audio = row.getCell(4).getStringCellValue();
            String video = row.getCell(5).getStringCellValue();
            QuestionType type;
            if (!image.isEmpty()){
                type = QuestionType.IMAGE;
                image = "question/finish/" + image;
            } else if (!audio.isEmpty()){
                type = QuestionType.AUDIO;
                audio = "question/finish/" + audio;
            } else if (!video.isEmpty()){
                type = QuestionType.VIDEO;
                video = "question/finish/" + video;
            } else {
                type = QuestionType.TEXT;
            }
            Question newQuestion = new Question(question, answer, score, image, audio, video, type);
            switch (score){
                case 20:
                    mediumQuestions.add(newQuestion);
                    break;
                case 30:
                    hardQuestions.add(newQuestion);
                    break;
            }
        }
        finishQuestion.setMediumQuestions(mediumQuestions);
        finishQuestion.setHardQuestions(hardQuestions);
        return finishQuestion;
    }

    private List<Question> getExtraQuestion(Sheet sheet){
        List<Question> questions = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            Row row = sheet.getRow(i);
            String question = row.getCell(0).getStringCellValue();
            String answer = row.getCell(1).getStringCellValue();
            String image = row.getCell(3).getStringCellValue();
            String audio = row.getCell(4).getStringCellValue();
            String video = row.getCell(5).getStringCellValue();
            QuestionType type;
            if (!image.isEmpty()){
                type = QuestionType.IMAGE;
                image = "question/extra/" + image;
            } else if (!audio.isEmpty()){
                type = QuestionType.AUDIO;
                audio = "question/extra/" + audio;
            } else if (!video.isEmpty()){
                type = QuestionType.VIDEO;
                video = "question/extra/" + video;
            } else {
                type = QuestionType.TEXT;
            }

            questions.add(new Question(question, answer, 0, image, audio, video, type));
        }
        return questions;
    }

}
