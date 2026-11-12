"""
重新產生自架中文字型子集（內容新增大量新字時執行）。
用法：
  pip install fonttools brotli
  下載 Google Fonts 原檔：NotoSansTC[wght].ttf、NotoSerifTC[wght].ttf 放在本資料夾
  python3 build-tools/subset_fonts.py   （在 repo 根目錄執行）
未包含在子集裡的字（例如訪客留言中的罕見字）會自動改用系統字型顯示。
"""
import re, glob
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

def site_chars():
    s = set(chr(c) for c in range(0x20, 0x7f)) | set(chr(c) for c in range(0xff01, 0xff5f))
    s |= set('，。、；：？！「」『』（）《》〈〉…—～・．％＋－＝／＆＠＃＄＊｜→←↑↓★☆')
    for f in glob.glob('**/*.html', recursive=True) + ['assets/js/site.js']:
        t = open(f, encoding='utf-8').read()
        s |= set(re.sub(r'<[^>]+>', '', t))
    return ''.join(sorted(s - set('\n\r\t')))

def build(src, rng, out, text):
    f = TTFont(src)
    o = subset.Options(); o.layout_features = ['kern', 'liga', 'palt', 'locl']; o.name_IDs = ['*']; o.notdef_outline = True
    s = subset.Subsetter(o); s.populate(text=text); s.subset(f)
    f = instancer.instantiateVariableFont(f, {'wght': rng})
    f.flavor = 'woff2'; f.save(out)

if __name__ == '__main__':
    text = site_chars()
    build('build-tools/NotoSansTC[wght].ttf', (400, 700), 'assets/fonts/noto-sans-tc-sub.woff2', text)
    build('build-tools/NotoSerifTC[wght].ttf', (700, 900), 'assets/fonts/noto-serif-tc-sub.woff2', text)
    print('done', len(text), 'chars')
