package com.raxim.myscoutee.profile.controller.game;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.game.GameDtos.UserGameCardsQueryRequestDto;
import com.raxim.myscoutee.profile.dto.game.GameDtos.UserGameCardsQueryResponseDto;

@RestController
@RequestMapping("/game-cards")
public class GameCardsController {

    @PostMapping("/query")
    public UserGameCardsQueryResponseDto queryCards(@RequestBody UserGameCardsQueryRequestDto request) {
        return new UserGameCardsQueryResponseDto(0, List.of(), null);
    }
}
