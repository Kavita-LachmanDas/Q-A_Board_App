
import studentFeedbackSchmea from "../model/studentFeedbackModel.js";

export const createFeedback = async(req,res)=>{
  try {
      const {teacherName,subject,rating,feedback} = req.body

    if(!teacherName || !subject || !rating || !feedback){
       return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    const createfeed = await studentFeedbackSchmea.create(req.body)
      return res.status(201).json({
      feedback: createfeed,
      success: true,
      message: "feedback created successfully!"
    });

  } catch (error) {
      res.status(500).json({
      success: false,
      message: "Feedback creation failed",
      error: error.message
    });
  }

}


export const getFeedback = async (req, res) => {
  try {
    const feedback = await studentFeedbackSchmea.find() // exclude password
    if (!feedback) return res.status(404).json({ msg: 'feedback not found' });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};


export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await studentFeedbackSchmea.findByIdAndDelete(req.params.id); // <-- fix here
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback", error: error.message });
  }
};
