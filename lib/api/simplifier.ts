export interface SimplifiedInstruction {
  medicine_id: string;
  name: string;
  dosage: string;
  category: string;
  instructions: string[];
}

const mockData: Record<string, SimplifiedInstruction[]> = {
  English: [
    {
      medicine_id: "m1",
      name: "Amoxicillin",
      dosage: "500mg",
      category: "Antibiotic for infection",
      instructions: [
        "Take 1 capsule three times a day",
        "Take with food to avoid stomach upset",
        "Finish the entire prescription even if you feel better",
      ],
    },
    {
      medicine_id: "m2",
      name: "Ibuprofen",
      dosage: "400mg",
      category: "Pain and inflammation relief",
      instructions: [
        "Take 1 tablet every 6 hours as needed for pain",
        "Do not exceed 4 tablets in 24 hours",
        "Take with food or milk",
      ],
    },
    {
      medicine_id: "m3",
      name: "Omeprazole",
      dosage: "20mg",
      category: "Acid reflux relief",
      instructions: [
        "Take 1 capsule daily before breakfast",
        "Swallow whole, do not crush or chew",
      ],
    },
  ],
  Hindi: [
    {
      medicine_id: "m1",
      name: "एमोक्सिसिलिन (Amoxicillin)",
      dosage: "500mg",
      category: "संक्रमण के लिए एंटीबायोटिक",
      instructions: [
        "दिन में तीन बार 1 कैप्सूल लें",
        "पेट खराब होने से बचने के लिए भोजन के साथ लें",
        "बेहतर महसूस होने पर भी पूरी दवा खत्म करें",
      ],
    },
    {
      medicine_id: "m2",
      name: "इबुप्रोफेन (Ibuprofen)",
      dosage: "400mg",
      category: "दर्द और सूजन से राहत",
      instructions: [
        "दर्द होने पर हर 6 घंटे में 1 गोली लें",
        "24 घंटे में 4 गोलियों से अधिक न लें",
        "भोजन या दूध के साथ लें",
      ],
    },
    {
      medicine_id: "m3",
      name: "ओमेप्राज़ोल (Omeprazole)",
      dosage: "20mg",
      category: "एसिडिटी से राहत",
      instructions: [
        "नाश्ते से पहले रोज़ाना 1 कैप्सूल लें",
        "पूरा निगल लें, कुचलें या चबाएं नहीं",
      ],
    },
  ],
  Tamil: [
    {
      medicine_id: "m1",
      name: "அமாக்சிசிலின் (Amoxicillin)",
      dosage: "500mg",
      category: "தொற்றுக்கான நுண்ணுயிர் எதிர்ப்பி",
      instructions: [
        "ஒரு நாளைக்கு மூன்று முறை 1 காப்ஸ்யூல் எடுத்துக் கொள்ளுங்கள்",
        "வயிற்று உபாதையைத் தவிர்க்க உணவுடன் எடுத்துக் கொள்ளவும்",
        "நீங்கள் நன்றாக உணர்ந்தாலும் முழு மருந்து சீட்டையும் முடிக்கவும்",
      ],
    },
    {
      medicine_id: "m2",
      name: "ஐபுபுரூஃபன் (Ibuprofen)",
      dosage: "400mg",
      category: "வலி மற்றும் வீக்க நிவாரணம்",
      instructions: [
        "வலிக்கு தேவைப்பட்டால் ஒவ்வொரு 6 மணி நேரத்திற்கும் 1 மாத்திரை எடுத்துக் கொள்ளவும்",
        "24 மணி நேரத்தில் 4 மாத்திரைகளைத் தாண்ட வேண்டாம்",
        "உணவு அல்லது பாலுடன் எடுத்துக் கொள்ளவும்",
      ],
    },
    {
      medicine_id: "m3",
      name: "ஒமேப்ரசோல் (Omeprazole)",
      dosage: "20mg",
      category: "அமிலத்தன்மை நிவாரணம்",
      instructions: [
        "காலை உணவுக்கு முன் தினமும் 1 காப்ஸ்யூல் எடுத்துக் கொள்ளவும்",
        "முழுவதும் விழுங்கவும், நசுக்கவோ மெல்லவோ வேண்டாம்",
      ],
    },
  ],
};

export async function simplifyPrescription(
  documentId: string,
  language: string = "English"
): Promise<SimplifiedInstruction[]> {
  // Simulate AI processing delay (~1-1.2s)
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 200));

  return mockData[language] || mockData["English"];
}
