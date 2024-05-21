import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin  # 상대 경로를 절대 경로로 변환하기 위해 필요

# 대학교 웹사이트 URL 목록
urls = [
    "https://global.psu.edu/category/incoming-exchange-students",
    "https://kelley.iu.edu/programs/undergrad/academics/study-abroad/international-exchange-students.html",
    "https://global.psu.edu/category/incoming-exchange-students",
    "https://www.umb.edu/academics/global-programs/international-exchange-students/",
    "https://www.clarkson.edu/about/departments/international-center/international-students-and-scholars",
    "https://issp.ucsc.edu/students/exchange/",
    "https://ie.utdallas.edu/education-abroad/incoming-exchange/",
    "https://www.sjsu.edu/isss/scholars/exchange/",
    "https://www.unf.edu/coggin/international-business/exchange-students.html",
    "https://uh.edu/learningabroad/find-a-program/exchange-programs/"
]

# 메인 키워드와 하위 키워드 매핑
keywords = {
    "Location": ["city", "country"],
    "Semester": ["fall", "spring", "summer"],
    "Application Deadlines": ["deadline", "due date", "Application"],
    "Courses": ["course", "curriculum", "enrollment", "catalog", "academics"],
    "Tuition": ["fees", "cost"],
    "Housing": ["accommodation", "living"],
    "Visa": ["visa requirement", "immigration"],
    "Eligibility": ["eligibility", "requirement"],
    "Requirements": ["prerequisite", "qualification"]
}

# 데이터를 저장할 딕셔너리 초기화, URL을 처음에 넣음
data = {'University URL': urls}
for main_keyword in keywords:
    data[main_keyword] = []

# 첫 글자를 대문자로 변환하는 함수
def capitalize_first_letter(text):
    return text.capitalize()

# 각 URL에 대해 반복
for url in urls:
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 결과를 저장할 임시 딕셔너리
    temp_data = {main_keyword: "" for main_keyword in keywords}
    
    # 모든 h, p, ul, ol, li 태그 찾기
    elements = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li'])
    
    # 각 텍스트 블록을 순회하며 키워드 검색
    for element in elements:
        if element.name in ['ul', 'ol']:
            list_items = element.find_all('li', recursive=False)
            items_text = '\n'.join(f"• {item.get_text(strip=True)}" if element.name == 'ul' else f"- {item.get_text(strip=True)}" for item in list_items)
            text_content = f"{items_text}"
        else:
            text_content = element.get_text(strip=True).lower()

        links = element.find_all('a')
        link_text = " ".join([f"(Link: {urljoin(url, a['href'])})" for a in links if a.has_attr('href')])
        
        for main_keyword, sub_keywords in keywords.items():
            # 메인 키워드와 하위 키워드를 모두 검색
            if any(keyword.lower() in text_content for keyword in [main_keyword] + sub_keywords):
                combined_text = text_content + " " + link_text
                temp_data[main_keyword] += combined_text + "\n"
    
    # 각 키워드에 대해 추출된 데이터를 저장
    for main_keyword in keywords:
        formatted_data = "\n".join([capitalize_first_letter(line) for line in temp_data[main_keyword].strip().split("\n")])
        data[main_keyword].append(formatted_data if formatted_data else "No data found")

# 데이터프레임 생성
df = pd.DataFrame(data)

# 엑셀 파일로 저장
df.to_excel("university_information.xlsx", index=False)
