import React from "react";

export default class NoMatch extends React.Component{
    render() {
        return (
            <div className='Page_404'>
                <nav className="shelf">
                    <a className="book home-page" href='#/client'>首页</a>
                    <a className="book about-us" href='https://www.medebound.com/'>美联医邦</a>
                    <span className="book not-found"></span>

                    <span className="door left"></span>
                    <span className="door right"></span>
                </nav>
                <div className='page_404_content'>
                    <h1 style={{color:"#fff"}}>Error 404</h1>
                    <h3 style={{color:"#fff"}}>糟糕，您要找的药品不在仓库中。。。</h3>
                </div>
            </div>
        );
    }
}