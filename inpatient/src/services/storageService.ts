import { PersonalNote, ResidentBookmark } from '../types/clinical';

const BOOKMARKS_KEY = 'cdss_resident_bookmarks';
const NOTES_KEY = 'cdss_personal_notes';

// Initial default notes to give residents a helpful template
const DEFAULT_NOTES: PersonalNote[] = [
  {
    id: 'note-sample-1',
    topicId: 'approach-chest-pain',
    topicTitle: 'Tiếp Cận Bệnh Nhân Đau Ngực',
    topicType: 'approach',
    title: 'Case lâm sàng giao ban: Bệnh nhân ĐMC bóc tách type A',
    content: 'Bệnh nhân nam 58 tuổi tiền sử THA không đều, vào viện vì đau xé ngực lan sau lưng 2 bả vai. Huyết áp tay phải 170/95, tay trái 135/80 (chênh 35 mmHg). ECG chỉ có dày thất trái không có ST chênh. Siêu âm tim mờ mỏm, CTA ngực cấp cứu phát hiện flap bóc tách từ gốc ĐMC lên quai. Bài học: Tuyệt đối không cho Plavix hay Heparin vội vàng khi chưa đo HA 2 tay!',
    tags: ['Cấp cứu', 'Tim mạch', 'Bóc tách ĐMC', 'Bates Ch.16'],
    clinicalCaseExample: 'BN Nam, 58T, Khoa Cấp Cứu BV Chợ Rẫy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-sample-2',
    topicId: 'gastrointestinal-exam',
    topicTitle: 'Khám Bụng & Hệ Tiêu Hóa',
    topicType: 'exam',
    title: 'Kinh nghiệm sờ bờ gan và lách to ở bệnh nhân xơ gan',
    content: 'Khi khám lách to độ 1-2, nếu nằm ngửa không rõ hãy cho bệnh nhân xoay nghiêng phải 45 độ, luồn bàn tay trái nâng lồng ngực trái từ sau ra trước, tay phải đón lách khi thở sâu. Nhớ gõ khoảng Traube trước khi sờ. Đục khoảng Traube là gợi ý lách to rất có giá trị.',
    tags: ['Khám bụng', 'Tiêu hóa', 'Xơ gan', 'Macleod Ch.6'],
    clinicalCaseExample: 'BN Nữ, 62T, Viêm gan B mạn tính',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-sample-3',
    topicId: 'approach-fever-fuo',
    topicTitle: 'Tiếp Cận Bệnh Nhân Sốt Kéo Dài & Sốt Chưa Rõ Nguyên Nhân (FUO)',
    topicType: 'approach',
    title: 'Ca lâm sàng minh họa: Sốt kéo dài 4 tuần do Viêm động mạch tế bào khổng lồ (GCA/PMR)',
    content: 'Bệnh nhân nữ 68 tuổi nhập viện vì sốt kéo dài 4 tuần (38.4 - 39.0°C về chiều/đêm) kèm sụt 4 kg, mệt mỏi, đau mỏi vai gáy và cứng khớp buổi sáng > 45 phút, đau âm ỉ thái dương phải khi chải đầu. Đã điều trị Amox/Clav và Ciprofloxacin tại tuyến cơ sở không hạ sốt. Khám lâm sàng: ĐM thái dương nông bên phải hơi gồ, ấn đau nhẹ, mạch đập yếu hơn bên trái. Hạn chế vận động hai khớp vai do đau. Xét nghiệm: Hb 95 g/L, Tiểu cầu 465, CRP 118 mg/L, ESR 105 mm/h (tăng cực độ > 100 mm/h). Cấy máu 3 bộ, cấy nước tiểu, IGRA, ANA, RF, ANCA, CT ngực-bụng-chậu cản quang đều âm tính. Siêu âm Doppler ĐM thái dương phát hiện dấu hiệu quầng sáng (Halo sign). Sinh thiết ĐM thái dương: thâm nhiễm tế bào viêm một nhân qua các lớp thành mạch, phá hủy màng chun trong kèm tế bào khổng lồ đa nhân. Chẩn đoán xác định: Viêm động mạch tế bào khổng lồ (GCA) phối hợp Đau đa cơ do thấp (PMR). Xử trí: Khởi đầu Prednisone 50 mg/ngày + Canxi/Vit D + PPI -> Cắt sốt hoàn toàn sau 48h, giảm đau đầu rõ sau 3 ngày, CRP giảm về 12 mg/L sau 2 tuần. Bài học cốt lõi: Người cao tuổi (> 50 tuổi) sốt kéo dài kèm đau đầu hoặc đau vùng đai cơ luôn phải sờ nắn ĐM thái dương và làm tốc độ máu lắng ESR khẩn cấp!',
    tags: ['Sốt kéo dài', 'FUO', 'GCA', 'PMR', 'Bates Ch.4', 'Delphi Consensus', 'Ca lâm sàng'],
    clinicalCaseExample: 'BN Nữ, 68T, Sốt kéo dài 4 tuần - Viêm động mạch tế bào khổng lồ (GCA)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const storageService = {
  // Bookmarks
  getBookmarks(): ResidentBookmark[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse bookmarks from storage', e);
      return [];
    }
  },

  isBookmarked(topicId: string): boolean {
    const list = this.getBookmarks();
    return list.some(b => b.id === topicId);
  },

  toggleBookmark(bookmark: Omit<ResidentBookmark, 'addedAt' | 'isMastered'>): boolean {
    const list = this.getBookmarks();
    const existingIndex = list.findIndex(b => b.id === bookmark.id);
    let added = false;

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
    } else {
      list.push({
        ...bookmark,
        addedAt: new Date().toISOString(),
        isMastered: false
      });
      added = true;
    }

    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save bookmark', e);
    }

    return added;
  },

  toggleMastered(topicId: string): boolean {
    const list = this.getBookmarks();
    const item = list.find(b => b.id === topicId);
    if (!item) return false;
    item.isMastered = !item.isMastered;
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to update mastery', e);
    }
    return item.isMastered;
  },

  // Notes
  getNotes(): PersonalNote[] {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      if (!data) {
        localStorage.setItem(NOTES_KEY, JSON.stringify(DEFAULT_NOTES));
        return DEFAULT_NOTES;
      }
      const parsed: PersonalNote[] = JSON.parse(data);
      // Automatically inject default FUO case study if not yet present in existing storage
      if (!parsed.some(n => n.topicId === 'approach-fever-fuo')) {
        const fuoNote = DEFAULT_NOTES.find(n => n.topicId === 'approach-fever-fuo');
        if (fuoNote) {
          parsed.push(fuoNote);
          localStorage.setItem(NOTES_KEY, JSON.stringify(parsed));
        }
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse notes from storage', e);
      return DEFAULT_NOTES;
    }
  },

  getNotesByTopic(topicId: string): PersonalNote[] {
    const notes = this.getNotes();
    return notes.filter(n => n.topicId === topicId);
  },

  saveNote(note: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>, id?: string): PersonalNote {
    const notes = this.getNotes();
    const now = new Date().toISOString();

    if (id) {
      const index = notes.findIndex(n => n.id === id);
      if (index >= 0) {
        notes[index] = {
          ...notes[index],
          ...note,
          updatedAt: now
        };
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        return notes[index];
      }
    }

    const newNote: PersonalNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    notes.unshift(newNote);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save note', e);
    }
    return newNote;
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to delete note', e);
    }
  }
};
