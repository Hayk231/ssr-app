import axios from 'axios';
import Link from 'next/link';
import MainContainer from './components/MainContainer';
import classes from './films.module.scss'
import Router from 'next/router'
import React, {useState, useRef} from 'react';
import StackGrid from "react-stack-grid";

const Films = ({films}) => {
    let gridRef = useRef(() => {});

   const [expandedId,setExpandedId] = useState('');

    const expandCard = (event, film) => {
        let target = document.getElementById(film.id);
        setExpandedId(film.id);
        target.parentElement.classList.add(classes.single_film_expanded);
        target.classList.add(classes.single_film_cont_expanded);
        let cloned = target.parentElement.cloneNode(true);
        setTimeout(() => {
            let infoCont = document.createElement('div');
            infoCont.className = classes.single_film_cont_info;
            infoCont.innerHTML = `
                <h1>${film.fullTitle}</h1>
                <p>Crew: ${film.crew}</p>
                <p>IMDb Rating: ${film.imDbRating}</p>
            `;
            cloned.appendChild(infoCont);
            document.querySelector(`.${classes.grid_parent}`).appendChild(cloned);
            target.parentElement.remove();
            gridRef.updateLayout();
            Router.push(`/films/${film.id}`)
        }, 800)
    };

    return (
        <MainContainer keywords={films.map(el => el.title).join(', ')}>
            <div className="header">Header</div>
            <div className={classes.grid_parent}>
                <StackGrid
                    columnWidth={250}
                    gutterWidth={50}
                    gutterHeight={10}
                    duration={800}
                    gridRef={ref => gridRef = ref}
                >
                    {
                        films.map(film => {
                            return (
                                <div className={classes.single_film}
                                     style={{opacity: expandedId ? film.id == expandedId ? '1' : '0' : '1'}}
                                     onClick={(e) => expandCard(e, film)}
                                     id={film.id}
                                     key={film.id}>
                                    <img src={film.image}></img>
                                    {film.title}
                                </div>
                            )
                        })
                    }

                </StackGrid>
            </div>
        </MainContainer>
    )
};

export default Films;


export async function getStaticProps() {
    let films = await axios.get('http://git.bigbek.com/-/snippets/1/raw/master/FilmList.json')
                            .then(res => (res.data.items))
    films = films.splice(0,10)


    return {
      props: {films},
    }
  }
