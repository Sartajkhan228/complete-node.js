

export const get404 = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Api route not found"
    })

}