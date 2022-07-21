import { useRef, useState } from 'react';
import errorImg from '../../assets/loading.gif';
import loadingImg from '../../assets/loading.gif';
export default function Img(props) {
    const {
        style = {},
        src = "",
        alt = "",
        errImg = errorImg,
    } = props;
    const imgRef = useRef(null);
    const [error, setError] = useState(false);
    const [neededSrc, setNeededSrc] = useState(loadingImg || src);
    const [random, setRandom] = useState();

    // 加载失败
    const onError = (obj) => {
        setNeededSrc(errorImg);
    }

    // img加载
    const onLoad = (url) => {
        setError(false);
        // 创建一个img标签
        const imgDom = new Image();
        imgDom.src = url;
        imgDom.onload = function () {
            setNeededSrc(url);
        }
        imgDom.onerror = () => {
            onError({});
        };
    }

    // 加载成功返回渲染
    return (
        <div ref={imgRef} className="img">
            <img 
                style={style}
                src={neededSrc}
                alt={alt}
                onLoad={() => onLoad(props?.src)}
                onError={() => onError({ url: errImg })}
            />
        </div>
    )
}
