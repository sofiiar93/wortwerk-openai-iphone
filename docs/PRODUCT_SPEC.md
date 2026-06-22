# Wortwerk Product Spec

## Positioning

Wortwerk is not a generic flashcard app. It is a workflow tool for learners who receive messy German vocabulary lists after class and need to turn them into practical training.

## MVP goal

Make the fastest useful product that can be installed on iPhone as a PWA and can train real German usage, not just passive recognition.

## User flow

1. User opens Wortwerk on iPhone or desktop.
2. User pastes a vocabulary list from a teacher.
3. Local parser creates draft cards.
4. OpenAI normalization corrects German, adds examples, grammar, mistakes, topic, and CEFR level.
5. User saves cards.
6. User reviews cards through DE→UA, UA→DE, cloze, and production exercises.
7. OpenAI checks learner answers.
8. SRS schedules the next review.
9. Mistakes screen shows weak points.

## Differentiator

The core value is turning raw classroom material into structured, active production exercises.

## MVP exclusions

- App Store native build
- payments
- teacher dashboard
- speech recognition
- social features
- advanced gamification
- custom model training

## Later versions

- Firebase user accounts as default storage
- push review reminders
- teacher class import
- native iOS wrapper with Capacitor
- voice production exercises
