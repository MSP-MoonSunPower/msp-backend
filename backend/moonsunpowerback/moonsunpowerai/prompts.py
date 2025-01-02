import boto3
import json
from django.conf import settings

def load_json_files_from_s3(bucket_name, folder_path, file_keys):
    """
    S3에서 주어진 파일 키 목록에 해당하는 JSON 파일을 읽어오는 함수.
    """
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    data = {}
    for file_key in file_keys:
        full_key = f"{folder_path}/{file_key}"
        try:
            response = s3.get_object(Bucket=bucket_name, Key=full_key)
            content = response['Body'].read().decode('utf-8')
            # 파일 이름에서 확장자를 제거하여 키로 사용
            data[file_key.replace('.json', '')] = json.loads(content)
        except Exception as e:
            print(f"Failed to load {full_key}: {e}")
            continue
    return data
# S3 버킷과 폴더 설정
BUCKET_NAME = settings.AWS_STORAGE_BUCKET_NAME

# 1. DIFFICULTY_PROMPTS
DIFFICULTY_PROMPTS = load_json_files_from_s3(
    bucket_name=BUCKET_NAME,
    folder_path="prompts",
    file_keys=[f"difficulty_{i}.json" for i in range(1, 6)]
)

# 2. TEXT_LENGTH
TEXT_LENGTH = load_json_files_from_s3(
    bucket_name=BUCKET_NAME,
    folder_path="text_length",
    file_keys=[f"{i}.json" for i in range(1, 5)]
)

# 3. PRESET_TOPICS
PRESET_TOPICS = load_json_files_from_s3(
    bucket_name=BUCKET_NAME,
    folder_path="preset_topics",
    file_keys=[f"{i}.json" for i in range(1, 7)]
)

# 4. TAG_TEXT_PROMPTS
TAG_TEXT_PROMPTS = load_json_files_from_s3(
    bucket_name=BUCKET_NAME,
    folder_path="tag_text_prompts",
    file_keys=[f"difficulty_{i}.json" for i in range(1, 5)]
)

# 5. WORD_DIFFICULTY_PROMPTS
WORD_DIFFICULTY_PROMPTS = load_json_files_from_s3(
    bucket_name=BUCKET_NAME,
    folder_path="word_difficulty_prompts",
    file_keys=[f"difficulty_{i}.json" for i in range(1, 5)]
)
# 6. MODEL_SELECTOR
MODEL_SELECTOR=load_json_files_from_s3(
    bucket_name=BUCKET_NAME,
    folder_path="model",
    file_keys=[f"difficulty_{i}.json" for i in range(1, 5)]
)
def setPresetPrompt(preset_topic,difficulty):
    difficulty_key = f"difficulty_{difficulty}"
    preset_topic=str(preset_topic)
    start_prompt = TAG_TEXT_PROMPTS[difficulty_key][0]
    end_prompt = TAG_TEXT_PROMPTS[difficulty_key][1]
    topic = PRESET_TOPICS[preset_topic]
    return f"{start_prompt}{topic}{end_prompt}"
