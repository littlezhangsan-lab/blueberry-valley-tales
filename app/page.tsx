"use client";

import { useEffect, useRef, useState } from "react";

type ReadingMode = "scroll" | "paged";
type Edition = "text" | "original";

type Chapter = {
  id: number;
  token: string;
  title: string;
  emotion: string;
  summary: string;
  pages: string[];
};

const chapters: Chapter[] = [
  { id:1, token:"影", title:"皮影班最后一个观众", emotion:"被记住，故事才真正演完", summary:"一座七十年没有谢幕的皮影台，只等最后一个观众。", pages:["只等一个观众","影子入戏","幕后的七十年","最后一个观众是谁","太慢的船夫","给故事一条慢路","真正的谢幕","故事结"] },
  { id:2, token:"信", title:"纸马驮来的第十三封信", emotion:"没有地址的思念也想被送达", summary:"一匹纸马跑了七十年，只为送出一封没有地址的信。", pages:["第十三封","第十二盏灯","一夜十二封","被挖掉的名字","纸马一直在写","最后一句话","可以回信的地址","第二枚故事结"] },
  { id:3, token:"名", title:"灯市只收旧名字", emotion:"名字是关系留下的证据", summary:"灯市不收钱，只收那些曾被人好好叫过的旧名字。", pages:["灯市开门","只收旧名字","名字被拿走","小灯笼","卖掉以后","不是那几个字","名字的证据","不能撑开的伞"] },
  { id:4, token:"伞", title:"雨巷里不能撑开的伞", emotion:"等待不是永远停在原地", summary:"一把伞困住一场雨，也困住一个不肯往前走的约定。", pages:["伞在等谁","一撑就重来","第七码头石","被抹掉的寻找","声音不在身后","把约定带走","会往前走的等待","伞骨里的半张脸"] },
  { id:5, token:"面", title:"借脸的傩面", emotion:"勇气不是借来的另一张脸", summary:"戴上傩面就能变勇敢，可借来的脸迟早要归还。", pages:["倒影先笑","还面棚","勇敢的笑脸","平静的假面","面具背后的怕","用自己的声音","不必借来的脸","封口香包"] },
  { id:6, token:"梦", title:"香包里睡着的坏梦", emotion:"被照顾过的恐惧也需要被听见和释放", summary:"一个被缝得太牢的坏梦，在香包里轻轻敲门。", pages:["门环上的香包","里面有人敲门","日出前要缝回去","针脚全在里面","最大的坏梦","被照顾太久","让梦自己醒来","一根羽线"] },
  { id:7, token:"衣", title:"午夜自己绣完的百鸟衣", emotion:"温柔也包括允许离开", summary:"百鸟衣在午夜落下最后一针，绣上去的鸟却想飞走。", pages:["羽线去的地方","每绣完一只鸟","最后一针以前","谁想留下","不许走的结","让它自己挑","百鸟离衣","无纹的旧衣"] },
  { id:8, token:"灯", title:"桥下多出来的一盏河灯", emotion:"名字是一份被回应的邀请", summary:"桥下明明只有二十四盏灯，水里却多出一个回答。", pages:["第二十五盏","桥不认它","借你的小名","名字把路带错","先听它回答","暂时叫归桥","桥有了倒影","水里的簧片"] },
  { id:9, token:"偶", title:"会替主人说谎的木偶", emotion:"说真话会失去什么", summary:"主人还没开口，木偶已经替他把最熟练的谎说完。", pages:["木偶先开口","假话会打结","主人的供词","木纹里的证词","别替我回答","主人没有逃","第九枚故事结","少半句口令"] },
  { id:10, token:"鼓", title:"没有被敲响的年鼓", emotion:"清晨不是一个英雄敲回来的", summary:"年鼓少了一拍，整个蓝莓谷的清晨退回雾里。", pages:["清晨退回雾里","第一拍吞进夜里","越快灯越少","回声从巷子里来","不是替他们敲完","把一拍送到门前","每个人的一拍","雾里不要数人"] },
  { id:11, token:"雾", title:"雾中经过的迎亲队", emotion:"不要用名册证明谁属于这里", summary:"迎亲队每点一次名就会换位，还有一个孩子从未被写进名册。", pages:["雾开迎亲","清点换位","回来了就进门","多出的小脚印","第三次点名","一个也不能留在外面","我叫小灯笼","第十一枚故事结"] },
  { id:12, token:"结", title:"收走所有故事的无名兽", emotion:"最先被遗忘的，也最想被讲述", summary:"第十二声钟没有响。一个没有名字的故事，正收走所有结局。", pages:["第十二声没有来","谁讲完谁被收走","它护着什么","十一个没坏的故事","我也有过第一句","没人独自讲完","第一个故事","十二声一起响"] },
];

const numerals = ["零","壹","贰","叁","肆","伍","陆","柒","捌","玖","拾","拾壹","拾贰"];
const pad = (value:number) => String(value).padStart(2,"0");
const imagePath = (chapter:number,page:number,edition:Edition) => `/${edition === "text" ? "comics" : "comics-original"}/${pad(chapter)}/${pad(page)}.webp`;

export default function Home() {
  const [reading,setReading] = useState(false);
  const [chapterId,setChapterId] = useState(1);
  const [page,setPage] = useState(1);
  const [mode,setMode] = useState<ReadingMode>("scroll");
  const [edition,setEdition] = useState<Edition>("text");
  const [drawer,setDrawer] = useState(false);
  const [resume,setResume] = useState({chapter:1,page:1});
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
  const chapter = chapters[chapterId-1];

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem("blueberry-progress") || "null");
      if (progress?.chapter) setResume(progress);
      const savedMode = localStorage.getItem("blueberry-mode") as ReadingMode | null;
      const savedEdition = localStorage.getItem("blueberry-edition") as Edition | null;
      if (savedMode) setMode(savedMode);
      if (savedEdition) setEdition(savedEdition);
      const match = location.hash.match(/^#read\/(\d{1,2})(?:\/(\d))?/);
      if (match) {
        setChapterId(Math.min(12,Math.max(1,Number(match[1]))));
        setPage(Math.min(8,Math.max(1,Number(match[2] || 1))));
        setReading(true);
      }
    } catch { /* keep defaults */ }
  },[]);

  useEffect(() => {
    if (!reading) return;
    const progress = {chapter:chapterId,page};
    setResume(progress);
    localStorage.setItem("blueberry-progress",JSON.stringify(progress));
    localStorage.setItem("blueberry-mode",mode);
    localStorage.setItem("blueberry-edition",edition);
    history.replaceState(null,"",`#read/${pad(chapterId)}/${page}`);
  },[reading,chapterId,page,mode,edition]);

  useEffect(() => {
    if (!reading || mode !== "scroll") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setPage(Number((visible.target as HTMLElement).dataset.page));
    },{threshold:[.3,.55,.75]});
    pageRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  },[reading,mode,chapterId,edition]);

  useEffect(() => {
    if (!reading) return;
    const onKey = (event:KeyboardEvent) => {
      if (["ArrowRight","ArrowDown","j","J"].includes(event.key)) { event.preventDefault(); movePage(1); }
      if (["ArrowLeft","ArrowUp","k","K"].includes(event.key)) { event.preventDefault(); movePage(-1); }
      if (event.key === "Escape") showHome();
    };
    window.addEventListener("keydown",onKey);
    return () => window.removeEventListener("keydown",onKey);
  });

  function openReader(id:number,startPage=1) {
    setChapterId(id); setPage(startPage); setReading(true); setDrawer(false);
    window.scrollTo({top:0,behavior:"instant"});
  }

  function showHome() {
    setReading(false); setDrawer(false); history.replaceState(null,"","#home"); window.scrollTo({top:0,behavior:"instant"});
  }

  function movePage(direction:number) {
    const next = Math.min(8,Math.max(1,page+direction));
    setPage(next);
    if (mode === "scroll") pageRefs.current[next-1]?.scrollIntoView({behavior:"smooth",block:"center"});
  }

  function changeChapter(direction:number) {
    const next = chapterId+direction;
    if (next < 1) return;
    if (next > 12) return showHome();
    openReader(next,1);
  }

  if (reading) {
    const nextChapter = chapters[chapterId];
    return (
      <main className={`reader reader-${mode}`}>
        <header className="reader-bar">
          <button className="square-button" type="button" onClick={showHome} aria-label="返回作品首页">←</button>
          <button className="reader-title" type="button" onClick={() => setDrawer(true)} aria-label="打开章节列表">
            <small>第 {pad(chapter.id)} 话</small><strong>{chapter.title}</strong><span>⌄</span>
          </button>
          <div className="reader-tools">
            <button type="button" onClick={() => setEdition(edition === "text" ? "original" : "text")}>{edition === "text" ? "有字版" : "无字原图"}</button>
            <button className="square-button" type="button" onClick={() => setMode(mode === "scroll" ? "paged" : "scroll")} aria-label={mode === "scroll" ? "切换单页阅读" : "切换连续阅读"}>{mode === "scroll" ? "▤" : "▣"}</button>
          </div>
        </header>
        <div className="progress"><span style={{width:`${((page-1)/7)*100}%`}} /></div>

        {mode === "scroll" ? (
          <>
            <section className="reader-opening">
              <span>异闻 · {numerals[chapter.id]}</span><h1>{chapter.title}</h1><p>{chapter.emotion}</p>
              <div><b>8 页</b><i></i><b>第一季</b><i></i><b>向下阅读</b></div>
            </section>
            <section className="comic-pages" aria-label={`第 ${pad(chapter.id)} 话漫画正文`}>
              {chapter.pages.map((title,index) => (
                <figure className="comic-page" key={title} data-page={index+1} ref={(node) => { pageRefs.current[index]=node; }}>
                  <img src={imagePath(chapter.id,index+1,edition)} alt={`第 ${index+1} 页：${title}`} loading={index>1 ? "lazy" : "eager"} />
                  <figcaption><span>{pad(index+1)}</span><i></i><span>{title}</span></figcaption>
                </figure>
              ))}
            </section>
            <section className="reader-finale">
              <small>本话完</small><span>◆</span><h2>{nextChapter ? `下一话 · ${nextChapter.title}` : "第一季 · 全十二话完"}</h2>
              <div><button type="button" onClick={() => changeChapter(-1)} disabled={chapterId===1}>← 上一话</button><button type="button" onClick={() => changeChapter(1)}>{nextChapter ? "阅读下一话 →" : "回到作品首页 →"}</button></div>
            </section>
          </>
        ) : (
          <section className="paged-stage" aria-label={`第 ${page} 页`}>
            <img src={imagePath(chapter.id,page,edition)} alt={`第 ${page} 页：${chapter.pages[page-1]}`} />
            <button className="page-arrow page-prev" type="button" onClick={() => movePage(-1)} disabled={page===1} aria-label="上一页">‹</button>
            <button className="page-arrow page-next" type="button" onClick={() => movePage(1)} disabled={page===8} aria-label="下一页">›</button>
            <span className="page-count">{pad(page)} / 08</span>
          </section>
        )}

        {drawer && <div className="drawer-backdrop" role="presentation" onClick={() => setDrawer(false)}>
          <section className="chapter-drawer" role="dialog" aria-modal="true" aria-label="选择异闻" onClick={(event) => event.stopPropagation()}>
            <header><div><small>第一季</small><h2>选择异闻</h2></div><button type="button" onClick={() => setDrawer(false)} aria-label="关闭章节列表">×</button></header>
            <div>{chapters.map((item) => <button key={item.id} type="button" onClick={() => openReader(item.id,1)} className={item.id===chapterId ? "active" : ""}>
              <span>{pad(item.id)}</span><img src={imagePath(item.id,1,"text")} alt="" loading="lazy" /><div><strong>{item.title}</strong><small>{item.emotion}</small></div><b>→</b>
            </button>)}</div>
          </section>
        </div>}
      </main>
    );
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="蓝莓谷异闻录首页"><span>异闻</span><div><strong>蓝莓谷异闻录</strong><small>TALES FROM BLUEBERRY VALLEY</small></div></a>
        <nav aria-label="主要导航"><a href="#chapters">十二话</a><a href="#about">关于本季</a><button type="button" onClick={() => openReader(resume.chapter,resume.page)}>继续 · {pad(resume.chapter)}</button></nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="season"><span>第一季</span>全十二话 · 已完结</div>
          <p className="kicker">蓝莓谷入夜后，故事会自己找上门。</p>
          <h1><span>蓝莓谷</span><em>异闻录</em></h1>
          <p className="intro">皮影不肯谢幕，旧名字被摆上灯市，无名的故事藏进雾里。懒懒与泓泓循着十二枚“故事结”，去听那些差一点被忘记的声音。</p>
          <div className="actions"><button type="button" onClick={() => openReader(1,1)}>从第一话开始 <span>→</span></button><button type="button" onClick={() => openReader(resume.chapter,resume.page)}>继续上次阅读</button></div>
          <dl><div><dt>12</dt><dd>话异闻</dd></div><div><dt>96</dt><dd>页完成稿</dd></div><div><dt>01</dt><dd>条完整线索</dd></div></dl>
        </div>
        <div className="hero-art">
          <div className="art-frame"><img src="/comics/01/01.webp" alt="《皮影班最后一个观众》第一页" /></div>
          <aside><small>异闻编号</small><strong>壹</strong><span>皮影班最后一个观众</span></aside>
        </div>
      </section>

      <section className="thread" aria-label="第一季故事线索"><p>一根看不见的线，穿过十二件旧物</p><div>{chapters.map((item) => <span key={item.id}>{item.token}</span>)}</div></section>

      <section className="chapters" id="chapters">
        <header><div><small>卷一</small><h2>十二则异闻</h2></div><p>每一话独立成篇，也共同指向最后一个没有名字的故事。</p></header>
        <div className="chapter-grid">{chapters.map((item) => <article key={item.id}>
          <button type="button" onClick={() => openReader(item.id,1)} aria-label={`阅读第 ${pad(item.id)} 话《${item.title}》`}>
            <div className="chapter-cover"><img src={imagePath(item.id,1,"text")} alt="" loading="lazy" /><span>{item.token}</span><b>已完结</b></div>
            <small>异闻 {pad(item.id)}</small><strong>{item.title}</strong><p>{item.summary}</p><i>阅读本话 →</i>
          </button>
        </article>)}</div>
      </section>

      <section className="about" id="about"><div className="about-mark">结</div><div><small>关于本季</small><h2>被记住，故事才真正演完。</h2><p>《蓝莓谷异闻录》把东方民俗器物、温柔悬疑与蓝莓谷的日常放进同一盏灯里。这里的怪异并不急着吓人，它们只是等待太久，想把没讲完的那句话说完。</p></div><blockquote>“<p>最先被遗忘的，<br/>也最想被讲述。</p><cite>第一季 · 终章</cite></blockquote></section>
      <footer><div><span>蓝莓谷</span><strong>故事会自己找到愿意听的人。</strong></div><p>《蓝莓谷异闻录》第一季 · 全十二话</p></footer>
    </main>
  );
}
