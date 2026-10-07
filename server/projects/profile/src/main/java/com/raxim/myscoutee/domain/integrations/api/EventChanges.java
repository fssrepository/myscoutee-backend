package com.raxim.myscoutee.domain.integrations.api;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
public interface EventChanges { void enqueue(Event event); void enqueue(Member member); }
