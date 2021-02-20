import Router, {useRouter} from 'next/router'
import axios from 'axios';
import MainContainer from '../components/MainContainer';
import React, { useState, useEffect, useRef } from 'react';
import classes from "../films.module.scss";
import StackGrid from "react-stack-grid";

export default function singleFilmPage({films}) {

    let gridRef = useRef(null);
    const {query} = useRouter();


    useEffect(() => {
        let singleFilm = films.find(el => el.id == query.id);
        setTimeout(() => {
            let target = document.getElementById(query.id);
            expandCard(target, singleFilm)
        }, 1)
    },[]);

    const [expandedId,setExpandedId] = useState('');
    const [gridData,setgridData] = useState('');

    const expandCard = (currentTarget, film) => {
        setExpandedId(film.id);
        let target = currentTarget;
        let infoCont = document.createElement('div');
        infoCont.className = classes.single_film_cont_info_force;
        infoCont.innerHTML = `
                <h1>${film.fullTitle}</h1>
                <p>Crew: ${film.crew}</p>
                <p>IMDb Rating: ${film.imDbRating}</p>
            `;
        target.appendChild(infoCont);
        target.style.overflow = 'visible';
        target.parentElement.classList.add(classes.single_film_expanded_force);
        target.classList.add(classes.single_film_cont_expanded_force);
        let cloned = target.parentElement.cloneNode(true);
        setTimeout(() => {

            document.querySelector(`.${classes.grid_parent_force}`).appendChild(cloned);
            setgridData(gridRef)
            gridRef.updateLayout();
        }, 800)
    };

    const closeCard = () => {
        let expanded =  document.querySelectorAll(`.${classes.single_film_expanded_force}`)
        expanded[1].remove();
        expanded[0].classList.remove(classes.single_film_expanded_force);
        document.querySelector(`.${classes.single_film_cont_info_force}`).remove();
        document.querySelector(`.${classes.single_film_cont_expanded_force}`)
        .classList.remove(classes.single_film_cont_expanded_force);
        document.querySelector(`.${classes.grid_parent_force}`)
        .classList.remove(classes.no_transition);
        setExpandedId('');
        gridData.updateLayout();
        setTimeout(() =>  Router.push(`/films`), 300)
    }
    
    return (
        <MainContainer keywords={films.find(el => el.id == query.id).title}>
            <div className="header" onClick={closeCard}><span>Film List</span></div>
            <div className={`${classes.grid_parent_force} ${classes.no_transition}`}>
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
}


  export async function getServerSideProps({params}) {
    let films = await axios.get(`http://git.bigbek.com/-/snippets/1/raw/master/FilmList.json`)
    .then(res => (res.data.items))
      films = films.splice(0,10)


    return {
        props: {films},
    }
  }
