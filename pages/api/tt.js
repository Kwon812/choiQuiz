import axios from "axios";
import {pokemonList} from "@/util/pokemon";


export default async function handler(req,res){

    const data=[
        {
            "optionNo": 137082391,
            "optionInputs": [],
            "orderCnt": 3,
            "productNo": 114754705,
            "cartNo": 1,
            "expireDate": 1209600290
        },
        {
            "optionNo": 452403426,
            "optionInputs": [],
            "orderCnt": 1,
            "productNo": 132736546,
            "cartNo": 2,
            "expireDate": 1209600752
        },
        {
            "productNo": 133053491,
            "optionNo": 469192185,
            "orderCnt": "4",
            "optionInputs": [],
            "cartNo": 3,
            "expireDate": 1209600826
        }
    ]

    const id='HJGfZ5jPHZk3/PEOkm+/Qw=='
    const pokemonAll=pokemonList.map(async (pokemonId)=> axios.get(`https://shop-api.e-ncp.com/products/${pokemonId}`,{
        headers: {
            clientid: "HJGfZ5jPHZk3/PEOkm+/Qw==",
            platform: "MOBILE_WEB",
            version: "1.0",
            "content-type": "application/json"
        }
    }))
    if(req.method==='GET'){
        try {
            const result = await Promise.all(pokemonAll)

            const re=result.map(({data})=> {
                // console.log(data.baseInfo)
                return {
                    productNo: data.baseInfo.productNo,
                    productName:data.baseInfo.productName,
                    stock:data.stock
                }
            })
            return res.status(200).send(re)
        }catch (e){
            console.log(e.response.data)
        }

    }
}