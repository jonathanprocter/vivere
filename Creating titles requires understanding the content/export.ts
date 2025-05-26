import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, format = 'pdf' } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required userId parameter' });
    }

    // Get all journal entries for the user
    const journalEntries = await prisma.journalEntry.findMany({
      where: { userId: userId as string },
      orderBy: { timestamp: 'desc' },
    });

    if (journalEntries.length === 0) {
      return res.status(404).json({ error: 'No journal entries found' });
    }

    // Handle different export formats
    if (format === 'text') {
      // Create text export
      let textContent = 'VIVERE JOURNAL EXPORT\n\n';
      
      journalEntries.forEach(entry => {
        const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        textContent += `Date: ${date}\n`;
        textContent += `Mood: ${JSON.parse(entry.moodTags).join(', ')}\n\n`;
        textContent += `${entry.transcript}\n\n`;
        
        if (entry.summary) {
          textContent += `Summary: ${entry.summary}\n\n`;
        }
        
        textContent += '-------------------------------------------\n\n';
      });
      
      // Set headers for text download
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename=vivere-journal-export.txt');
      
      return res.status(200).send(textContent);
    } else if (format === 'pdf') {
      // Create PDF export using pdf-lib
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Add a cover page
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      page.drawText('VIVERE JOURNAL', {
        x: 50,
        y: height - 100,
        size: 30,
        font: timesRomanBoldFont,
      });
      
      page.drawText('remember to live', {
        x: 50,
        y: height - 140,
        size: 16,
        font: timesRomanFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      page.drawText(`Export Date: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font: timesRomanFont,
      });
      
      page.drawText(`Total Entries: ${journalEntries.length}`, {
        x: 50,
        y: height - 220,
        size: 12,
        font: timesRomanFont,
      });
      
      // Add entries to PDF
      journalEntries.forEach(entry => {
        page = pdfDoc.addPage();
        
        const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        let yPosition = height - 50;
        
        // Date
        page.drawText(date, {
          x: 50,
          y: yPosition,
          size: 16,
          font: timesRomanBoldFont,
        });
        
        yPosition -= 30;
        
        // Mood tags
        const moodTags = JSON.parse(entry.moodTags).join(', ');
        page.drawText(`Mood: ${moodTags}`, {
          x: 50,
          y: yPosition,
          size: 12,
          font: timesRomanFont,
          color: rgb(0.5, 0.5, 0.5),
        });
        
        yPosition -= 40;
        
        // Transcript (with word wrapping)
        const transcript = entry.transcript;
        const words = transcript.split(' ');
        let line = '';
        const maxWidth = width - 100;
        
        for (const word of words) {
          const testLine = line + word + ' ';
          const lineWidth = timesRomanFont.widthOfTextAtSize(testLine, 12);
          
          if (lineWidth > maxWidth) {
            page.drawText(line, {
              x: 50,
              y: yPosition,
              size: 12,
              font: timesRomanFont,
            });
            
            line = word + ' ';
            yPosition -= 20;
            
            // If we're at the bottom of the page, add a new page
            if (yPosition < 50) {
              page = pdfDoc.addPage();
              yPosition = height - 50;
            }
          } else {
            line = testLine;
          }
        }
        
        // Draw the last line
        if (line.trim().length > 0) {
          page.drawText(line, {
            x: 50,
            y: yPosition,
            size: 12,
            font: timesRomanFont,
          });
          yPosition -= 40;
        }
        
        // Summary
        if (entry.summary && yPosition > 100) {
          page.drawText('Summary:', {
            x: 50,
            y: yPosition,
            size: 14,
            font: timesRomanBoldFont,
          });
          
          yPosition -= 25;
          
          // Summary text with word wrapping
          const summaryWords = entry.summary.split(' ');
          line = '';
          
          for (const word of summaryWords) {
            const testLine = line + word + ' ';
            const lineWidth = timesRomanFont.widthOfTextAtSize(testLine, 12);
            
            if (lineWidth > maxWidth) {
              page.drawText(line, {
                x: 50,
                y: yPosition,
                size: 12,
                font: timesRomanFont,
                color: rgb(0.3, 0.3, 0.3),
              });
              
              line = word + ' ';
              yPosition -= 20;
              
              // If we're at the bottom of the page, add a new page
              if (yPosition < 50) {
                page = pdfDoc.addPage();
                yPosition = height - 50;
              }
            } else {
              line = testLine;
            }
          }
          
          // Draw the last line of summary
          if (line.trim().length > 0) {
            page.drawText(line, {
              x: 50,
              y: yPosition,
              size: 12,
              font: timesRomanFont,
              color: rgb(0.3, 0.3, 0.3),
            });
          }
        }
      });
      
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=vivere-journal-export.pdf');
      
      return res.status(200).send(Buffer.from(pdfBytes));
    } else {
      return res.status(400).json({ error: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Error exporting journal:', error);
    return res.status(500).json({ error: 'Failed to export journal' });
  }
}
