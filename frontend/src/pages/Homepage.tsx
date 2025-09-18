import Button from "../components/Button";

function Homepage() {
  return (
    <>
      <main className="w-full h-full grow-1 p-[10%] flex justify-center items-start gap-6 flex-col text-2xl">
        <p>
          一般来说，个人博客会用某种方式介绍自己，
          用一两句话说说自己的职业，价值观或是一句座右铭。
        </p>
        <p>
          这些话也不例外，只是想到这我大脑几乎空白，似乎我还没有找到定义自己的角度，
          我是学生，不过快要结束十几年的“求学生涯”了，我也许会步入职场，但是估计我也不爱上班。
        </p>
        <p>
          仿佛谈起自我介绍，就必须谈论人生的意义一样，好像一定要认真说说。
          目前我喜欢的东西不多：阅读，运动，音乐，影视，旅行。
        </p>
        <p>
          我的人生目标是在一个静谧的接近自然的地方生活、读书、做饭、身旁有爱人和三五好友陪伴。
          在合适的季节，去世界各地转转，去见见不同的人；
          大多数时候，待在家中做自己喜欢的事情，再在落日时分出去跑跑步。
        </p>
        <p>
          也许人生最大的意义就在于感受吧。如果不能实现目标的话，那么这一路上的感受也是不错的，这样也挺好的。
          哦对了，如果有机会，我想我会去创业。如果生命明天就结束，那么我仍会这样选择。
        </p>
        <Button size="small">Hello，世界！</Button>
        <Button variant="secondary" size="mid">Hello，世界！</Button>
        <Button size="large">Hello，世界！</Button>
      </main>
    </>
  );
}

export default Homepage;
