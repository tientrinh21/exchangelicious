import requests
from bs4 import BeautifulSoup

# 검색할 URL
url = 'https://pisa.ucsc.edu/class_search/index.php'

# 검색 조건
data = {
    'action': 'results',
    'binds[:term]': '2244',  # 예: 2024 Summer Quarter
    'binds[:session_code]': '',  # 모든 세션
    'binds[:reg_status]': 'O',  # Open Classes
    # 추가 필터 조건
}

# POST 요청으로 데이터 전송
response = requests.post(url, data=data)

# 응답으로 반환된 HTML 분석
soup = BeautifulSoup(response.text, 'html.parser')

# 필요한 정보 추출
# 예: 강의 목록
courses = soup.find_all('div', class_='course-info')
for course in courses:
    print(course.text)
