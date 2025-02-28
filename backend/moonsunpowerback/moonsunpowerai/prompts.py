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
USER_SELECT_TEXT_PROMPTS = load_files(
    os.path.join(PROMPTS_DIR, "user_select_text_prompt"),
    [f"user_select_text_prompt_{i}.txt" for i in range(1, 5)]
)

# 2. 텍스트 길이 (text_length 폴더) - 키를 단순 숫자 문자열로 저장
TEXT_LENGTH = load_files(
    os.path.join(PROMPTS_DIR, "text_length"),
    [f"text_length_{i}.txt" for i in range(1, 5)],
    key_func=lambda key: key.replace("text_length_", "").replace(".txt", "")
)

# 3. 태그 주제 텍스트 (tag_topics_text 폴더) - 키를 단순 숫자 문자열로 저장
TAG_TOPICS_TEXT = load_files(
    os.path.join(PROMPTS_DIR, "tag_topics_text"),
    [f"tag_topics_text_{i}.txt" for i in range(1, 7)],
    key_func=lambda key: key.replace("tag_topics_text_", "").replace(".txt", "")
)

# 4. 태그 텍스트 프롬프트 (tag_text_prompt 폴더, 파일 내 내용은 리스트 형태)
TAG_TEXT_PROMPTS = load_files(
    os.path.join(PROMPTS_DIR, "tag_text_prompt"),
    [f"tag_text_prompt_{i}.py" for i in range(1, 5)]
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
    preset_topic_key: 예) "1" (혹은 "tag_topics_text_1")
    difficulty: 태그 텍스트 프롬프트 번호 (정수)
    """
    preset_topic_key = str(preset_topic_key)
    tag_prompt = TAG_TEXT_PROMPTS.get(f"tag_text_prompt_{difficulty}")
    if not tag_prompt or not isinstance(tag_prompt, list) or len(tag_prompt) < 2:
        print(f"Error: tag_text_prompt_{difficulty}가 리스트 형식(최소 2요소)이 아닙니다.")
        return ""
    start_prompt = tag_prompt[0]
    end_prompt = tag_prompt[1]
    
    # 먼저 단순 숫자 키로 조회
    topic = TAG_TOPICS_TEXT.get(preset_topic_key)
    # 없으면 "tag_topics_text_" 접두어를 붙여서 조회
    if not topic:
        topic = TAG_TOPICS_TEXT.get(f"tag_topics_text_{preset_topic_key}")
    if not topic:
        print(f"Error: {preset_topic_key}에 해당하는 태그 주제 텍스트를 찾을 수 없습니다.")
        return ""
    
    return f"{start_prompt}{topic}{end_prompt}"
