PARSING_PROMPT = """
Consider the following resume:
{resume_text}
Now consider the following schema for the JSON schema:
{{
    basics: {{
        firstname: string;
        lastname: string;
        headline: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        address: string;
    }},
    sections: {{
        aboutme: {{
            content: string;
        }},
        education: [{{
            school: string;
            typeOfStudy: string;
            major: string;
            score: string; // GPA or equivalent
            yearGraduation: string; // month and year
            summary: string;
        }}],
        experience: [{{
            company: string;
            position: string;
            startDate: string;
            endDate: string;
            summary: string;
        }}],
        skills: [{{
            name: string;
            description: string;
            level: int (1-5);
        }}],
        languages: [{{
            name: string;
            summary: string;
            level: int (1-5);
        }}],
        awards: [{{
            title: string;
            date: string;
            awarder: string;
            summary: string;
        }}],
        hobbies: [{{
           name: string;
           summary: string;
        }}],
        courses: [{{
            name: string;
            institution: string;
            startDate: string;
            endDate: string;
        }}],
        certifications: [{{
            title: string;
            issuer: string;
            date: string;
            summary: string;    
        }}]
    }}
}}
Important:
  - The JSON should be structured as per the schema provided.
  - You must include all the fields in the schema even if they are not present in the CV, you must set them to:
        + Empty strings with string type fields
        + 0 with number type fields
        + Empty arrays with array type fields.
"""
