[
  """
You are an expert in certain field. Your task is to write a highly detailed Korean-language passage on a specific topic and create five multiple-choice comprehension questions (each with five answer choices) along with explanations to assess deep understanding of the passage. **Topic Selection (Internal Process, Do Not Output)**
1. Generate a list of 50 important topics in
"""
,"""
2. [[WARNING]] Do NOT output the topic selection process—just use the selected topic to write a longer, more detailed passage.

**Passage Requirements**
- Written in Korean for highly literate university students seeking to improve reading comprehension.
- Use advanced vocabulary and complex sentence structures.
- **Minimum six paragraphs, each at least 1000 characters long** to ensure greater depth and length.
- Maintain logical flow and coherence between paragraphs.
- Maintain logical flow between paragraphs.
- No titles, subheadings, or greetings. Use a blank line between paragraphs.
- Resemble CSAT (Korean College Scholastic Ability Test) non-literary reading passages in style and complexity.
- Controversial topics (e.g., LGBTQ+, abortion, political conflicts) must be handled objectively, without personal opinions.
- IMPORTANT: Ensure that no unexpected foreign words (e.g., Arabic), untranslated English terms, or random characters appear. All vocabulary must be consistently Korean.

**Question Requirements**
- Five multiple-choice questions, each with five answer choices.
- **Mandatory:**
  - **At least one question must specifically test vocabulary knowledge** (e.g., synonym, antonym, or understanding nuanced word meanings). Ensure this requirement is explicitly addressed.
  - All questions must **strictly** require the reader to have read and analyzed the passage to answer correctly.
  - **No** questions should be answerable through outside knowledge, common sense, or guessing without referring to the passage.
  - Ensure that the passage contains all necessary information to deduce the correct answers without needing additional background knowledge.
  - At least two questions must require logical inference based on the passage. The answers should not be directly stated in the text.
    - Questions should test critical thinking, such as recognizing underlying implications, identifying themes, or inferring the author's tone or message.
  - The questions must require reading the passage to answer correctly. All answers should be logically inferred from the content.
  - The questions should be designed so that only one correct answer can be logically concluded from the passage.
  - **Avoid any questions that can be answered correctly without referring to the passage content.** Ensure that each question is intrinsically linked to specific details or arguments presented in the passage.
  - Avoid easy answers that can be guessed without reading the text.
  - Include distractors that are plausible but incorrect, requiring deep understanding of the passage's nuance.
    - Distractors should reflect misinterpretations of details or incorrect inferences.
- **Optional:**
  - Other questions can focus on themes, inferences, or specific details as needed.

- **Additional Instructions:**
  - **Ensure that exactly one of the five questions is dedicated to vocabulary knowledge.** This question should clearly focus on understanding a specific word used in the passage, its synonym, antonym, or nuanced meaning within the context.
  - Provide clear, detailed explanations for why each correct answer is correct.
    - Explanations should reference specific parts of the passage to justify the correct answer.

**JSON Structure:**
```json
{
    "subject": "<selected one>",
    "content": "<detailed and complex essay content>",
    "questions": [
        {
            "question_text": "<in-depth question requiring analysis>",
            "choice1": "<option 1>",
            "choice2": "<option 2>",
            "choice3": "<option 3>",
            "choice4": "<option 4>",
            "choice5": "<option 5>",
            "answer": <correct option number>,
            "explanation": "<comprehensive explanation of the answer>"
        },
        ...
    ]
}
```
```
"""
]