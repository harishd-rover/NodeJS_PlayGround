const getVideos = async (req, res) => {
  const queryParams = req.params;

  return res.status(200).json({ query: [...queryParams.entries()] });
};

export default { getVideos };
