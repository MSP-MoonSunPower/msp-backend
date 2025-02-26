import json
from django.conf import settings
import os

def load_json_files_from_local(folder_path, file_keys):
    data = {}
    for file_key in file_keys:
        full_path = os.path.join(folder_path, file_key)
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                data[file_key.replace('.json', '')] = json.loads(content)
        except Exception as e:
            print(f"Failed to load {full_path}: {e}")
            continue
    return data

# 현재 파일(prompts.py)이 위치한 디렉터리의 두 단계 상위 폴더를 찾습니다.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROMPTS_DIR = os.path.join(BASE_DIR, "prompts")

# 0. 오늘의 지문
try:
    with open(os.path.join(PROMPTS_DIR, "today_text"), 'r', encoding='utf-8') as f:
        TODAY_TEXT = f.read()
except Exception as e:
    print(f"Failed to load today_text: {e}")
    TODAY_TEXT = ""

# 1. DIFFICULTY_PROMPTS (PROMPTS_DIR 하위에 difficulty_*.json 파일들이 있다고 가정)
DIFFICULTY_PROMPTS = load_json_files_from_local(
    folder_path=PROMPTS_DIR,
    file_keys=[f"difficulty_{i}.json" for i in range(1, 5)]
)

# 2. TEXT_LENGTH (PROMPTS_DIR/text_length 폴더)
TEXT_LENGTH = load_json_files_from_local(
    folder_path=os.path.join(PROMPTS_DIR, "text_length"),
    file_keys=[f"{i}.json" for i in range(1, 5)]
)

# 3. PRESET_TOPICS (PROMPTS_DIR/preset_topics 폴더)
PRESET_TOPICS = load_json_files_from_local(
    folder_path=os.path.join(PROMPTS_DIR, "preset_topics"),
    file_keys=[f"{i}.json" for i in range(1, 7)]
)

# 4. TAG_TEXT_PROMPTS (PROMPTS_DIR/tag_text_prompt 폴더)
TAG_TEXT_PROMPTS = load_json_files_from_local(
    folder_path=os.path.join(PROMPTS_DIR, "tag_text_prompt"),
    file_keys=[f"difficulty_{i}.json" for i in range(1, 5)]
)

# 5. WORD_DIFFICULTY_PROMPTS (PROMPTS_DIR/word_difficulty_prompts 폴더)
try:
    with open(os.path.join(PROMPTS_DIR, "dictionary.txt"), 'r', encoding='utf-8') as f:
        DICTIONARY_TEXT = f.read()
except Exception as e:
    print(f"Failed to load dictionary.txt: {e}")
    DICTIONARY_TEXT = ""

# 6. MODEL_SELECTOR (PROMPTS_DIR/model_type 폴더, model_type_1.json ~ model_type_4.json)
MODEL_SELECTOR = load_json_files_from_local(
    folder_path=os.path.join(PROMPTS_DIR, "model_type"),
    file_keys=[f"model_type_{i}.json" for i in range(1, 5)]
)

def setPresetPrompt(preset_topic, difficulty):
    difficulty_key = f"difficulty_{difficulty}"
    preset_topic = str(preset_topic)
    start_prompt = TAG_TEXT_PROMPTS[difficulty_key][0]
    end_prompt = TAG_TEXT_PROMPTS[difficulty_key][1]
    topic = PRESET_TOPICS[preset_topic]
    return f"{start_prompt}{topic}{end_prompt}"
