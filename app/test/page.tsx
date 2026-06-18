
export default async function TestPage() {
    const data=await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/quests/personal',{
        method: 'GET',

    })

    console.log(data)


    return (
        <>

        </>
    )
}
