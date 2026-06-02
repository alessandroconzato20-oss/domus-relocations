import { describe, it, expect } from 'vitest';
import { generateQuizReportPDF, type QuizReportData } from './pdf-report';

describe('PDF Report Generation', () => {
  const mockQuizData: QuizReportData = {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    profileName: 'The Discerning Family',
    profileDescription: 'Your priority is a seamless, complete transition for your entire family, from finding the perfect home in the right neighborhood to ensuring your children thrive in a world-class school. DOMUS is built for families like yours.',
    recommendations: ['Private Relocation Advisory', 'School Advisory', 'Milan Integration'],
    leadScore: 85,
    timeline: 'Within 3 months',
    familyComposition: 'Family with young children',
    preferences: ['School selection', 'Neighbourhood advisory'],
    preferredContact: 'A private phone call',
    relocationExperience: 'This is my first international move',
  };

  it('should generate a PDF buffer', async () => {
    const pdfBuffer = await generateQuizReportPDF(mockQuizData);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it('should generate PDF with correct header', async () => {
    const pdfBuffer = await generateQuizReportPDF(mockQuizData);
    const pdfString = pdfBuffer.toString('utf8', 0, Math.min(pdfBuffer.length, 1000));
    
    // PDF files start with %PDF signature
    expect(pdfString.substring(0, 4)).toBe('%PDF');
  });

  it('should handle different lead scores', async () => {
    const highPriorityData: QuizReportData = {
      ...mockQuizData,
      leadScore: 90,
    };
    
    const standardData: QuizReportData = {
      ...mockQuizData,
      leadScore: 60,
    };
    
    const futurePlanningData: QuizReportData = {
      ...mockQuizData,
      leadScore: 30,
    };
    
    const highPriorityPDF = await generateQuizReportPDF(highPriorityData);
    const standardPDF = await generateQuizReportPDF(standardData);
    const futurePlanningPDF = await generateQuizReportPDF(futurePlanningData);
    
    expect(highPriorityPDF.length).toBeGreaterThan(0);
    expect(standardPDF.length).toBeGreaterThan(0);
    expect(futurePlanningPDF.length).toBeGreaterThan(0);
  });

  it('should handle long profile descriptions', async () => {
    const longDescriptionData: QuizReportData = {
      ...mockQuizData,
      profileDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    };
    
    const pdfBuffer = await generateQuizReportPDF(longDescriptionData);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it('should handle multiple recommendations', async () => {
    const multiRecData: QuizReportData = {
      ...mockQuizData,
      recommendations: [
        'Private Relocation Advisory',
        'School Advisory',
        'Milan Integration',
        'Neighbourhood Advisory',
        'Legal Advisory',
        'Tax Planning',
      ],
    };
    
    const pdfBuffer = await generateQuizReportPDF(multiRecData);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it('should generate PDF with correct size for contact info', async () => {
    const pdfBuffer = await generateQuizReportPDF(mockQuizData);
    
    // PDF should be large enough to contain all content
    expect(pdfBuffer.length).toBeGreaterThan(1000);
  });

  it('should handle special characters in profile name', async () => {
    const specialCharData: QuizReportData = {
      ...mockQuizData,
      profileName: 'The Sophisticated Expat & Family',
    };
    
    const pdfBuffer = await generateQuizReportPDF(specialCharData);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it('should generate PDFs with reasonable size', async () => {
    const data1 = await generateQuizReportPDF(mockQuizData);
    const data2 = await generateQuizReportPDF(mockQuizData);
    
    // Both PDFs should have content
    expect(data1.length).toBeGreaterThan(1000);
    expect(data2.length).toBeGreaterThan(1000);
  });
});
