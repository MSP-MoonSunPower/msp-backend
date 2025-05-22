import os
import ast

def load_file(folder_path, file_key):
    full_path = os.path.join(folder_path, file_key)
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # 확장자가 .py인 경우 안전하게 평가하여 리스트로 변환
        if file_key.endswith('.py'):
            try:
                return ast.literal_eval(content)
            except Exception as e:
                print(f"Failed to evaluate {full_path}: {e}")
                return content
        return content
    except Exception as e:
        print(f"Failed to load {full_path}: {e}")
        return None

def load_files(folder_path, file_keys, key_func=None):
    data = {}
    for key in file_keys:
        content = load_file(folder_path, key)
        if content is not None:
            if key_func:
                dict_key = key_func(key)
            else:
                if key.endswith('.txt'):
                    dict_key = key.replace('.txt', '')
                elif key.endswith('.py'):
                    dict_key = key.replace('.py', '')
                else:
                    dict_key = key
            data[dict_key] = content
    return data

# 현재 파일(prompts.py)이 위치한 디렉터리의 세 단계 상위 폴더
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROMPTS_DIR = os.path.join(BASE_DIR, "prompts")

# 0. 오늘의 지문 (today_text.txt)
try:
    with open(os.path.join(PROMPTS_DIR, "today_text.txt"), 'r', encoding='utf-8') as f:
        TODAY_TEXT = f.read()
except Exception as e:
    print(f"Failed to load today_text.txt: {e}")
    TODAY_TEXT = ""

# 1. 사용자 선택 텍스트 프롬프트 (user_select_text_prompt 폴더)
USER_SELECT_TEXT_PROMPTS = {}
base_prompt_dir = os.path.join(PROMPTS_DIR, "user_select_text_prompt")

for lang in ["korean", "english", "german"]:
    lang_dir = os.path.join(base_prompt_dir, lang)
    if not os.path.isdir(lang_dir):
        print(f"Directory not found: {lang_dir}")
        continue
    USER_SELECT_TEXT_PROMPTS[lang] = load_files(
        lang_dir,
        [f"user_select_text_prompt_{i}.txt" for i in range(1, 5)],
        key_func=lambda key: key.replace(".txt", "")
    )


# 2. 텍스트 길이 (text_length 폴더) - 키를 단순 숫자 문자열로 저장
TEXT_LENGTH = load_files(
    os.path.join(PROMPTS_DIR, "text_length"),
    [f"text_length_{i}.txt" for i in range(1, 5)],
    key_func=lambda key: key.replace("text_length_", "").replace(".txt", "")
)

# 5. 단어 정의 사전 (word_definition_dictionary 폴더)
WORD_DEFINITION_DICTIONARY = load_files(
    os.path.join(PROMPTS_DIR, "word_definition_dictionary"),
    [f"word_definition_dictionary_{i}.txt" for i in range(1, 5)]
)

# 6. 모델 선택 (model_type 폴더, 확장자 없는 파일들)
MODEL_SELECTOR = load_files(
    os.path.join(PROMPTS_DIR, "model_type"),
    [f"model_type_{i}.txt" for i in range(1, 5)]
)

def setPresetPrompt(preset_topic_key, difficulty):
    """
    새 폴더 구조를 기반으로 프롬프트 파일을 불러오는 함수
    예: tag_topics_text_6/tag_topics_text_6_1.txt
    """
    topic_str = str(preset_topic_key)
    difficulty_str = str(difficulty)

    file_path = os.path.join(
        PROMPTS_DIR,
        "tag_topics_text",
        f"tag_topics_text_{topic_str}",
        f"tag_topics_text_{topic_str}_{difficulty_str}.txt"
    )

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Failed to load preset prompt from {file_path}: {e}")
        return ""