import requests
from bs4 import BeautifulSoup, Tag
from markdownify import markdownify as md

def extract_relevant_sections(url, keywords):
    # URL로부터 HTML 내용을 가져옴
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # 모든 h 태그를 가져옴
    headers = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    
    keyword_sections = {key: [] for key in keywords.keys()}
    
    for header in headers:
        # 현재 헤더와 다음 헤더 사이의 모든 내용을 포함하는 섹션을 추출
        section_content = []
        next_sibling = header
        while True:
            next_sibling = next_sibling.find_next_sibling()
            if next_sibling is None or (isinstance(next_sibling, Tag) and next_sibling.name.startswith('h')):
                break
            section_content.append(next_sibling)

        # 섹션 내용에 키워드가 포함되어 있는지 확인
        section_text = ''.join(str(tag) for tag in section_content).lower()
        for key, key_list in keywords.items():
            if any(keyword in section_text for keyword in key_list):
                keyword_sections[key].append((header, section_content))
                break
    
    # 마크다운 형식으로 변환
    markdown_output = ""
    for key, sections in keyword_sections.items():
        markdown_output += f"# {key}\n\n"
        if sections:
            for header, content in sections:
                # 큰 헤더를 서브 헤더로 변환
                if header.name in ['h1', 'h2']:
                    markdown_output += f"### {md(str(header))}\n"
                else:
                    markdown_output += md(str(header))
                
                for tag in content:
                    # 큰 헤더를 서브 헤더로 변환
                    if isinstance(tag, Tag) and tag.name in ['h1', 'h2']:
                        markdown_output += f"### {md(str(tag))}\n"
                    else:
                        markdown_output += md(str(tag))
                markdown_output += '\n\n'
        else:
            markdown_output += "no data\n\n"
    
    return markdown_output

def process_universities(universities, keywords):
    for university_name, url in universities.items():
        markdown_result = extract_relevant_sections(url, keywords)
        output_file_path = f'{university_name}.md'
        with open(output_file_path, 'w', encoding='utf-8') as file:
            file.write(markdown_result)
        print(f"Markdown file saved as {output_file_path}")

# 주어진 키워드
keywords = {
    "University": ["welcone"],
    "Location": ["city", "country", "welcome"],
    "Semester": ["fall", "spring", "summer"],
    "Application Deadlines": ["deadline", "due date", "Application", "apply"],
    "Courses": ["course", "curriculum", "enrollment", "catalog", "academics"],
    "Expenses": ["fees", "cost"],
    "Housing": ["accommodation", "living"],
    "Visa": ["visa requirement", "immigration"],
    "Eligibility": ["eligibility", "requirement", "proficiency"],
    "Requirements": ["prerequisite", "qualification", "insurance"]
}

# 테스트 대학 딕셔너리
universities = {
    'usa-mbu': 'https://www.umb.edu/academics/global-programs/international-exchange-students/',
    'usa-clarkson': 'https://www.clarkson.edu/about/departments/international-center/international-students-and-scholars/new-students-and-visitors',
    'usa-northpark': 'https://www.northpark.edu/admissions-aid/undergraduate-admissions/international-students/',
    'usa-ucsc': 'https://issp.ucsc.edu/students/exchange/',
    'usa-utdallas': 'https://ie.utdallas.edu/education-abroad/incoming-exchange/',
    'usa-sjsu': 'https://www.sjsu.edu/isss/scholars/exchange/',
    'usa-unf': 'https://www.unf.edu/coggin/international-business/exchange-students.html',
    'usa-houston': 'https://uh.edu/learningabroad/find-a-program/exchange-programs/'
}

process_universities(universities, keywords)
