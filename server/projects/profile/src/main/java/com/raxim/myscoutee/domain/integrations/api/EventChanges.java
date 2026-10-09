package com.raxim.myscoutee.domain.integrations.api;
import com.raxim.myscoutee.domain.events.api.EventChangeView;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
public interface EventChanges { void enqueue(EventChangeView event); void enqueue(Member member); void publishPendingEncounters(); }
