package com.raxim.myscoutee.domain.accounts.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.accounts.dto.GameDtos.UserGameCardsQueryRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.GameDtos.UserGameCardsQueryResponseDto;
import com.raxim.myscoutee.domain.accounts.service.HomeGameCardsService;

@RestController
@RequestMapping("/game-cards")
public class GameCardsController {
    private final HomeGameCardsService homeGameCardsService;

    public GameCardsController(HomeGameCardsService homeGameCardsService) {
        this.homeGameCardsService = homeGameCardsService;
    }

    @PostMapping("/query")
    public UserGameCardsQueryResponseDto queryCards(@RequestBody UserGameCardsQueryRequestDto request) {
        return homeGameCardsService.queryPage(request);
    }
}
