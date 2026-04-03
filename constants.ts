

import { Topic, VocabWord, SpeakingTemplate, Achievement, Section } from './types';

export const MAIN_SECTIONS: Section[] = [
  { 
    id: 'listening', 
    title: 'Аудирование', 
    germanTitle: 'Hörverstehen', 
    icon: 'Headphones', 
    description: 'Диалоги и упражнения', 
    path: '/section/listening',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'reading', 
    title: 'Чтение', 
    germanTitle: 'Lesen', 
    icon: 'BookOpen', 
    description: 'Тексты B2 и понимание', 
    path: '/section/reading',
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    id: 'grammar', 
    title: 'Грамматика', 
    germanTitle: 'Grammatik', 
    icon: 'Brain', 
    description: 'Passiv, Konjunktiv, etc.', 
    path: '/section/grammar',
    color: 'from-violet-500 to-purple-500'
  },
  { 
    id: 'vocab', 
    title: 'Словарь', 
    germanTitle: 'Wortschatz', 
    icon: 'Library', 
    description: 'Лексика по темам', 
    path: '/dictionary',
    color: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'speaking', 
    title: 'Разговор', 
    germanTitle: 'Redemittel', 
    icon: 'MessageCircle', 
    description: 'Шаблоны для устной части', 
    path: '/speaking',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'tests', 
    title: 'Тесты', 
    germanTitle: 'Tests & Quiz', 
    icon: 'FileText', 
    description: 'Проверка знаний', 
    path: '/section/tests',
    color: 'from-indigo-500 to-blue-600'
  },
  { 
    id: 'exam', 
    title: 'Экзамен', 
    germanTitle: 'Prüfungsvorbereitung', 
    icon: 'GraduationCap', 
    description: 'Советы и примеры', 
    path: '/section/exam',
    color: 'from-slate-600 to-slate-800'
  },
  { 
    id: 'progress', 
    title: 'Прогресс', 
    germanTitle: 'Mein Fortschritt', 
    icon: 'BarChart', 
    description: 'Статистика и достижения', 
    path: '/progress',
    color: 'from-green-500 to-emerald-600'
  },
];

export const TOPICS: Topic[] = [
  // 1. Hörverstehen (Listening)
  { id: 'b2-h-1', title: 'Kurze Dialoge', category: 'Listening', level: 'B2', description: 'Понимание деталей в коротких разговорах.' },
  { id: 'b2-h-2', title: 'Prüfungsaudios B2', category: 'Listening', level: 'B2', description: 'Длинные интервью и доклады.' },
  { id: 'b2-h-3', title: 'Lückentexte mit Audio', category: 'Listening', level: 'B2', description: 'Заполнение пропусков на слух.' },

  // 2. Lesen (Reading)
  { id: 'b2-l-1', title: 'Alltagstexte', category: 'Reading', level: 'B2', description: 'Понимание писем, объявлений, инструкций и сообщений.' },
  { id: 'b2-l-2', title: 'Prüfungstexte B2', category: 'Reading', level: 'B2', description: 'Академические и научно-популярные тексты (как на экзамене).' },
  { id: 'b2-l-3', title: 'Leseverstehen B2', category: 'Reading', level: 'B2', description: 'Глубокое понимание, поиск деталей и мнений.' },
  { id: 'b2-l-4', title: 'Synonyme & Paraphrasen', category: 'Reading', level: 'B2', description: 'Понимание перефразированной информации.' },

  // 3. Grammatik (Grammar)
  { id: 'b2-g-1', title: 'Konnektoren B2', category: 'Grammar', level: 'B2', description: 'Zweiteilige Konnektoren (zwar...aber, je...desto, etc.).' },
  { id: 'b2-g-2', title: 'Nominalisierung', category: 'Grammar', level: 'B2', description: 'Verbalstil zu Nominalstil (важно для письма).' },
  { id: 'b2-g-3', title: 'Passiv', category: 'Grammar', level: 'B2', description: 'Zustandspassiv, Passiversatzformen (sein+zu, -bar).' },
  { id: 'b2-g-4', title: 'Konjunktiv II', category: 'Grammar', level: 'B2', description: 'Irreale Wünsche, Vergleiche und Höflichkeit.' },
  { id: 'b2-g-5', title: 'Partizipialkonstruktionen', category: 'Grammar', level: 'B2', description: 'Распространенные определения (Der lesende Mann...).' },
  { id: 'b2-g-6', title: 'Relativsätze', category: 'Grammar', level: 'B2', description: 'С предлогами и в Genitiv.' },

  // 6. Tests
  { id: 'test-vocab-b2', title: 'Wortschatz-Test B2', category: 'Test', level: 'B2', description: 'Проверка лексики по всем темам.' },
  { id: 'test-gram-b2', title: 'Grammatik-Test B2', category: 'Test', level: 'B2', description: 'Сложный тест на грамматику.' },
  { id: 'test-full-b2', title: 'B2 Komplettprüfung', category: 'Test', level: 'B2', description: 'Мини-экзамен.' },

  // 7. Exam Prep
  { 
    id: 'exam-tips-write', 
    title: 'Tipps: Schriftlicher Ausdruck', 
    category: 'Exam', 
    level: 'B2', 
    description: 'Структура писем и разбор ошибок.',
    theoryContent: `
      <div class="space-y-8">
        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          На экзамене B2 (например, Telc или Goethe) вам часто нужно написать официальное письмо. У вас есть два основных типа заданий: <strong>Жалоба (Beschwerde)</strong> или <strong>Запрос информации (Bitte um Informationen)</strong>.
        </p>

        <!-- Beschwerde Section -->
        <section class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-800/30 shadow-sm">
          <h3 class="text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
            😡 1. Beschwerde (Жалоба)
          </h3>
          <p class="mb-4 text-sm text-red-700/80 dark:text-red-300/80 italic">Ситуация: Вы купили курс/товар, но он был ужасен. Вы требуете компенсацию.</p>
          
          <div class="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Betreff (Тема)</strong>
              <div class="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded">Beschwerde über Ihren Sprachkurs / Ihre Lieferung Nr. 12345</div>
            </div>
            
            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Anrede (Обращение)</strong>
              <div class="italic text-gray-800 dark:text-gray-200">Sehr geehrte Damen und Herren,</div>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Einleitung (Вступление)</strong>
              <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>Hiermit möchte ich mich über [den Kurs / das Produkt] beschweren.</li>
                <li>Ich schreibe Ihnen, weil ich mit Ihrer Leistung sehr unzufrieden bin.</li>
                <li>Leider entsprach der Kurs nicht der Beschreibung in der Anzeige.</li>
              </ul>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Argumentation (Аргументы)</strong>
              <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>In Ihrer Anzeige stand, dass ..., aber in Wirklichkeit ...</li>
                <li>Ein weiterer Kritikpunkt ist, dass ...</li>
                <li>Besonders enttäuscht war ich von der Tatsache, dass ...</li>
                <li>Statt [versprochene Leistung] gab es nur [reale Situation].</li>
              </ul>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Forderung (Требование)</strong>
              <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>Aus diesen Gründen erwarte ich eine Rückerstattung meiner Kosten.</li>
                <li>Ich fordere Sie auf, mir ... % des Preises zu erstatten.</li>
              </ul>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Schluss (Заключение)</strong>
              <div class="italic text-sm text-gray-700 dark:text-gray-300">Ich erwarte Ihre Antwort bis zum [Datum]. <br/> Mit freundlichen Grüßen</div>
            </div>
          </div>
        </section>

        <!-- Bitte um Information Section -->
        <section class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
          <h3 class="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
            ℹ️ 2. Bitte um Informationen (Запрос информации)
          </h3>
          <p class="mb-4 text-sm text-blue-700/80 dark:text-blue-300/80 italic">Ситуация: Вы хотите узнать подробности о курсе, стажировке или мероприятии.</p>

          <div class="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
             <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Betreff</strong>
              <div class="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded">Anfrage bezüglich Ihres Praktikumsangebots</div>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Einleitung</strong>
              <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>Ich habe Ihre Anzeige im Internet gelesen und interessiere mich sehr für ...</li>
                <li>Da ich noch einige offene Fragen habe, wende ich mich heute an Sie.</li>
              </ul>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Fragen stellen (Höfliche Form!)</strong>
              <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>Könnten Sie mir bitte mitteilen, wann der Kurs genau beginnt?</li>
                <li>Ich würde gerne wissen, welche Unterlagen ich einreichen muss.</li>
                <li>Außerdem wüsste ich gern, ob eine Unterkunft gestellt wird.</li>
                <li>Wäre es möglich, ein Zertifikat am Ende zu erhalten?</li>
              </ul>
            </div>

            <div>
              <strong class="block text-xs uppercase tracking-wider text-gray-500 mb-1">Schluss</strong>
              <div class="italic text-sm text-gray-700 dark:text-gray-300">Vielen Dank im Voraus für Ihre Bemühungen. Ich freue mich auf Ihre Antwort. <br/> Mit freundlichen Grüßen</div>
            </div>
          </div>
        </section>

        <!-- Common Mistakes Table -->
        <section class="mt-8">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            ✍️ Детальный разбор ошибок (Schriftlich)
          </h3>
          <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table class="w-full text-sm text-left text-gray-600 dark:text-gray-300">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th class="px-4 py-3 w-1/2">Falsch (Типичная ошибка) ❌</th>
                  <th class="px-4 py-3 w-1/2">Richtig (Как надо) ✅</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td class="px-4 py-3 text-red-600 dark:text-red-400">
                    <strong>Ich will</strong> mein Geld zurück.
                    <div class="text-xs text-gray-500 mt-1">Ошибка: Слишком грубо и прямо для официального письма.</div>
                  </td>
                  <td class="px-4 py-3 text-green-600 dark:text-green-400">
                    <strong>Ich möchte Sie bitten</strong>, mir die Kosten zu erstatten.
                    <div class="text-xs text-gray-500 mt-1">Konjunktiv II или "fordern" вежливо.</div>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td class="px-4 py-3 text-red-600 dark:text-red-400">
                    Weil das Hotel <strong>war</strong> schmutzig.
                    <div class="text-xs text-gray-500 mt-1">Ошибка: Глагол не на конце после "weil".</div>
                  </td>
                  <td class="px-4 py-3 text-green-600 dark:text-green-400">
                    ..., weil das Hotel schmutzig <strong>war</strong>.
                  </td>
                </tr>
                 <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td class="px-4 py-3 text-red-600 dark:text-red-400">
                    Sehr geehrte Damen und Herren, <strong>Ich</strong> schreibe...
                    <div class="text-xs text-gray-500 mt-1">Ошибка: Большая буква после запятой в обращении.</div>
                  </td>
                  <td class="px-4 py-3 text-green-600 dark:text-green-400">
                    Sehr geehrte Damen und Herren, <strong>ich</strong> schreibe...
                  </td>
                </tr>
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td class="px-4 py-3 text-red-600 dark:text-red-400">
                    Ich interessiere mich für <strong>Ihren Kurs besuchen</strong>.
                    <div class="text-xs text-gray-500 mt-1">Ошибка: "für" требует существительного (Akk), а не инфинитива.</div>
                  </td>
                  <td class="px-4 py-3 text-green-600 dark:text-green-400">
                    Ich interessiere mich für <strong>den Besuch</strong> Ihres Kurses.
                    <div class="text-xs text-gray-500 mt-1">Используйте Nominalisierung.</div>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td class="px-4 py-3 text-red-600 dark:text-red-400">
                    Wann <strong>beginnt</strong> der Kurs?
                    <div class="text-xs text-gray-500 mt-1">Слишком просто. Нужна косвенная речь.</div>
                  </td>
                  <td class="px-4 py-3 text-green-600 dark:text-green-400">
                    Könnten Sie mir sagen, wann der Kurs <strong>beginnt</strong>?
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `
  },
  { 
    id: 'exam-tips-speak', 
    title: 'Tipps: Mündliche Prüfung', 
    category: 'Exam', 
    level: 'B2', 
    description: 'Структура и ошибки в устной части.',
    theoryContent: `
      <div class="space-y-6">
        <p>Устный экзамен обычно состоит из двух частей: Презентация (Vortrag) и Дискуссия (Diskussion). Время: ок. 15 минут на пару.</p>

        <div>
          <h3 class="text-xl font-bold text-brand-700 dark:text-brand-300 mb-3">Teil 1: Präsentation (около 4 мин)</h3>
          <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ol class="list-decimal pl-5 space-y-2">
              <li>
                <strong>Einleitung (Вступление):</strong>
                <br><em class="text-gray-600 dark:text-gray-400">"Das Thema meines Vortrags lautet..." / "Ich spreche heute über..."</em>
              </li>
              <li>
                <strong>Struktur (Структура):</strong>
                <br><em class="text-gray-600 dark:text-gray-400">"Zuerst spreche ich über meine persönlichen Erfahrungen, dann über die Situation in meinem Heimatland, und schließlich nenne ich Vor- und Nachteile."</em>
              </li>
              <li>
                <strong>Erfahrungen & Heimatland:</strong>
                <br><em class="text-gray-600 dark:text-gray-400">"Ich persönlich habe erlebt, dass..." / "In meinem Land ist es üblich, dass..."</em>
              </li>
              <li>
                <strong>Vor- und Nachteile (Плюсы и минусы):</strong>
                <br><em class="text-gray-600 dark:text-gray-400">"Ein großer Vorteil ist natürlich..." / "Allerdings gibt es auch Nachteile, wie zum Beispiel..."</em>
              </li>
              <li>
                <strong>Abschluss (Заключение):</strong>
                <br><em class="text-gray-600 dark:text-gray-400">"Hiermit komme ich zum Schluss. Vielen Dank für Ihre Aufmerksamkeit."</em>
              </li>
            </ol>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold text-brand-700 dark:text-brand-300 mb-3">Teil 2: Diskussion (около 5 мин)</h3>
          <p class="mb-3">Вам нужно обсудить тему с партнером. Главное — <strong>реагировать</strong> на слова собеседника, а не просто говорить свой текст.</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
             <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200">
               <strong class="text-green-800 dark:text-green-300">Согласие:</strong>
               <ul class="mt-1 space-y-1">
                 <li>"Das sehe ich ganz genauso."</li>
                 <li>"Du hast völlig recht."</li>
                 <li>"Ein guter Punkt!"</li>
               </ul>
             </div>
             <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200">
               <strong class="text-red-800 dark:text-red-300">Возражение:</strong>
               <ul class="mt-1 space-y-1">
                 <li>"Da bin ich anderer Meinung."</li>
                 <li>"Das sehe ich etwas anders, denn..."</li>
                 <li>"Bist du sicher, dass...?"</li>
               </ul>
             </div>
             <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200">
               <strong class="text-blue-800 dark:text-blue-300">Компромисс:</strong>
               <ul class="mt-1 space-y-1">
                 <li>"Lass uns darauf einigen, dass..."</li>
                 <li>"Wie wäre es, wenn wir..."</li>
               </ul>
             </div>
          </div>
        </div>

        <!-- Speaking Mistakes Section -->
        <section class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
           <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">🚫 Häufige Fehler beim Sprechen (Типичные ошибки)</h3>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                 <strong class="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                   1. Молчание (Stille)
                 </strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 mb-2">
                   Самая большая ошибка — молчать, если забыли слово.
                 </p>
                 <div class="bg-white dark:bg-gray-800 p-2 rounded text-xs text-gray-600 dark:text-gray-400">
                   <strong>Решение:</strong> Используйте пауза-наполнители:
                   <ul class="list-disc pl-4 mt-1 italic">
                     <li>"Lassen Sie mich kurz nachdenken..."</li>
                     <li>"Wie sagt man das am besten..."</li>
                     <li>"Mir fällt das Wort gerade nicht ein, aber ich meine..."</li>
                   </ul>
                 </div>
              </div>

              <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                 <strong class="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                   2. Монолог (Monolog halten)
                 </strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 mb-2">
                   В дискуссии нельзя говорить 2 минуты подряд, не давая партнеру слова.
                 </p>
                 <div class="bg-white dark:bg-gray-800 p-2 rounded text-xs text-gray-600 dark:text-gray-400">
                   <strong>Решение:</strong> Задавайте вопросы:
                   <ul class="list-disc pl-4 mt-1 italic">
                     <li>"Wie siehst du das?"</li>
                     <li>"Was hältst du davon?"</li>
                     <li>"Stimmst du mir zu?"</li>
                   </ul>
                 </div>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                 <strong class="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                   3. "Denglish" / Ложные друзья
                 </strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 mb-2">
                   Использование английских слов или прямой перевод с родного языка.
                 </p>
                 <div class="bg-white dark:bg-gray-800 p-2 rounded text-xs text-gray-600 dark:text-gray-400">
                   <ul class="list-disc pl-4 mt-1">
                     <li>Falsch: "Ich bekomme ein Baby." (Я получаю ребенка? Нет, я рожаю.) -> Richtig: "Ich <strong>kriege</strong> ein Baby."</li>
                     <li>Falsch: "Ich will werden ein Arzt." -> Richtig: "Ich will Arzt <strong>werden</strong>." (Глагол в конец!)</li>
                   </ul>
                 </div>
              </div>

              <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                 <strong class="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                   4. "Nix verstehen"
                 </strong>
                 <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 mb-2">
                   Если вы не поняли вопрос экзаменатора.
                 </p>
                 <div class="bg-white dark:bg-gray-800 p-2 rounded text-xs text-gray-600 dark:text-gray-400">
                   <strong>Решение:</strong> Вежливо переспросить:
                   <ul class="list-disc pl-4 mt-1 italic">
                     <li>"Könnten Sie die Frage bitte wiederholen?"</li>
                     <li>"Habe ich Sie richtig verstanden, dass...?"</li>
                   </ul>
                 </div>
              </div>
           </div>
        </section>
        
        <div class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
           <strong class="text-yellow-800 dark:text-yellow-200">Совет:</strong> В устной части оценивается не только грамматика, но и <strong>Interaktion</strong> (взаимодействие). Смотрите на партнера, кивайте, улыбайтесь.
        </div>
      </div>
    `
  },
  {
    id: 'exam-tips-gen',
    title: 'Allgemeine Prüfungstipps',
    category: 'Exam',
    level: 'B2',
    description: 'Тайм-менеджмент и стратегии.',
    theoryContent: `
      <ul class="space-y-4">
        <li class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
           <strong class="text-lg block mb-1">⏱ Zeitmanagement</strong>
           <p>На чтении (Lesen) не застревайте на одном слове. Если не знаете слово, попробуйте понять его из контекста или пропустите. У вас мало времени.</p>
        </li>
        <li class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
           <strong class="text-lg block mb-1">📝 Ключевые слова</strong>
           <p>В аудировании (Hören) читайте вопросы <strong>ДО</strong> начала аудио. Подчеркивайте ключевые слова (W-Fragen: Wer? Wo? Wann?).</p>
        </li>
        <li class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
           <strong class="text-lg block mb-1">🔍 Проверка</strong>
           <p>В письме (Schreiben) обязательно оставьте 5 минут в конце, чтобы проверить текст на грамматику (окончания прилагательных, позиция глагола).</p>
        </li>
      </ul>
    `
  }
];

export const SPEAKING_TEMPLATES: SpeakingTemplate[] = [
  {
    id: 'tmpl-meinung',
    title: 'Meinung äußern',
    category: 'Diskussion',
    phrases: [
      { german: 'Ich bin der festen Überzeugung, dass...', russian: 'Я твердо убежден, что...' },
      { german: 'Meiner Ansicht nach spielt... eine wichtige Rolle.', russian: 'На мой взгляд... играет важную роль.' },
      { german: 'Ich vertrete den Standpunkt, dass...', russian: 'Я придерживаюсь точки зрения, что...' },
    ]
  },
  {
    id: 'tmpl-zustim',
    title: 'Zustimmung / Ablehnung',
    category: 'Diskussion',
    phrases: [
      { german: 'Das sehe ich ganz genauso.', russian: 'Я вижу это точно так же.' },
      { german: 'Da muss ich Ihnen leider widersprechen.', russian: 'Тут я вынужден вам возразить.' },
      { german: 'Das ist zwar ein wichtiger Punkt, aber...', russian: 'Это важный момент, но...' },
    ]
  },
  {
    id: 'tmpl-pres-start',
    title: 'Präsentation: Einleitung',
    category: 'Vortrag',
    phrases: [
      { german: 'Das Thema meiner Präsentation lautet...', russian: 'Тема моей презентации звучит...' },
      { german: 'Zunächst möchte ich über ... sprechen.', russian: 'Сначала я хотел бы поговорить о...' },
      { german: 'Danach komme ich zu den Vor- und Nachteilen.', russian: 'Затем я перейду к плюсам и минусам.' },
    ]
  },
  {
    id: 'tmpl-vermutung',
    title: 'Vermutungen ausdrücken',
    category: 'Bildbeschreibung',
    phrases: [
      { german: 'Es könnte sein, dass...', russian: 'Может быть, что...' },
      { german: 'Ich nehme an, dass...', russian: 'Я предполагаю, что...' },
      { german: 'Es sieht so aus, als ob...', russian: 'Выглядит так, как будто...' },
    ]
  }
];

export const MOCK_VOCAB: VocabWord[] = [
  { german: 'die Herausforderung', russian: 'вызов, испытание', example: 'Das ist eine große Herausforderung für mich.', level: 'B2', tags: ['Arbeit'] },
  { german: 'die Erfahrung', russian: 'опыт', example: 'Ich habe viel Erfahrung in diesem Bereich.', level: 'B1', tags: ['Arbeit'] },
  { german: 'umweltfreundlich', russian: 'экологичный', example: 'Wir sollten umweltfreundlich leben.', level: 'B2', tags: ['Umwelt'] },
  { german: 'abhängen von', russian: 'зависеть от', example: 'Das hängt vom Wetter ab.', level: 'B1', tags: ['Alltag'] },
  { german: 'begeistert sein von', russian: 'быть в восторге от', example: 'Ich bin von der Idee begeistert.', level: 'B2', tags: ['Gefühle'] },
  { german: 'die Maßnahme', russian: 'мера, мероприятие', example: 'Die Regierung muss Maßnahmen ergreifen.', level: 'B2', tags: ['Politik'] },
  { german: 'die Verantwortung', russian: 'ответственность', example: 'Jeder trägt Verantwortung für die Umwelt.', level: 'B2', tags: ['Gesellschaft'] },
  { german: 'fördern', russian: 'способствовать, поддерживать', example: 'Wir müssen junge Talente fördern.', level: 'B2', tags: ['Bildung'] },
];

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_step', 
    title: 'Первый шаг', 
    description: 'Завершите свой первый урок.', 
    icon: 'Flag', 
    conditionType: 'topic_count', 
    conditionValue: 1 
  },
  { 
    id: 'week_warrior', 
    title: 'Марафонец', 
    description: 'Занимайтесь 7 дней подряд.', 
    icon: 'Flame', 
    conditionType: 'streak', 
    conditionValue: 7 
  },
  { 
    id: 'perfectionist', 
    title: 'Перфекционист', 
    description: 'Пройдите тест без ошибок.', 
    icon: 'Star', 
    conditionType: 'quiz_perfect', 
    conditionValue: 1 
  },
  { 
    id: 'b2_master', 
    title: 'Магистр B2', 
    description: 'Пройдите все темы уровня B2.', 
    icon: 'GraduationCap', 
    conditionType: 'level_completion', 
    conditionValue: 'B2' 
  },
];
