import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Box,
  Button,
  Typography,
  IconButton,
  Modal,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_JOB,
  GET_ALL_JOB_CATEGORY,
  GET_JOB_BY_ID,
} from "@/app/(queries)/queries";
import { parseCookies } from "nookies";
import { useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import { CREATE_MANY_SCREENING_QUESTIONS } from "@/app/(queries)/queries"; 
const stepTwoSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        responseType: z.string().min(1, "Response Type is required"),
        idealAnswer: z.string().optional(),
        mustHaveQualification: z.boolean().optional(),
      })
    )
    .nonempty("At least one question is required"),
});

const StepTwo = ({ handleNext }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepTwoSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data) => {
    setFormData(data);
    setModalOpen(true); // Open modal to show preview
  };

  const cookies = parseCookies();
  const token = cookies.accessToken;
  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [createManyScreeningQuestion] = useMutation(CREATE_MANY_SCREENING_QUESTIONS);
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");


  const handleNextStep = async (data) => {
    try {
      // Map the questions array to match the mutation input structure
      const datas = data.questions.map((question, index) => ({
        questionIndex: index + 1,
        question: question.question,
        idealAnswer: question.idealAnswer || "", // default to an empty string if undefined
        mustHaveQualification: question.mustHaveQualification || false,
        responseType: question.responseType,
      }));
  
      const response = await createManyScreeningQuestion({
        variables: {
          datas, // Pass the array of questions
          jobId, // Pass the jobId
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
  
      handleNext(formData);
    } catch (error) {
      console.error("Error Creating Job:", error);
    }
  };
  

  const { loading, error, data, refetch } = useQuery(GET_JOB_BY_ID, {
    variables: { id: jobId },
    context: { headers: { Authorization: `Bearer ${token}` } },
  });

  return (
    <>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" sx={{ fontWeight: "bold", my: 3 }}>
          Add Screening Questions
        </Typography>

        {fields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography sx={{ my: 3 }}>
                Write a custom screening question.
              </Typography>
              <IconButton onClick={() => remove(index)}>
                  <CloseIcon />
                </IconButton>
            </Box>

            <Controller
              name={`questions[${index}].question`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 4 }}
                  error={!!errors.questions?.[index]?.question}
                  helperText={errors.questions?.[index]?.question?.message}
                />
              )}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                pb:3, borderBottom: '1px solid rgb(236, 236, 236)'
              }}
            >
              <Controller
                name={`questions[${index}].responseType`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Response Type"
                    select
                    variant="outlined"
                    fullWidth
                    sx={{ mr: 2 }}
                    error={!!errors.questions?.[index]?.responseType}
                    helperText={
                      errors.questions?.[index]?.responseType?.message
                    }
                  >
                    <MenuItem value="YES_OR_NO">Yes / No</MenuItem>
                    <MenuItem value="NUMERIC">Numeric</MenuItem>
                    <MenuItem value="TEXT">Text</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name={`questions[${index}].idealAnswer`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ideal Answer"
                    variant="outlined"
                    fullWidth
                    sx={{ mr: 2 }}
                  />
                )}
              />
              <Controller
                name={`questions[${index}].mustHaveQualification`}
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <input {...field} type="checkbox" id={`mustHaveQualification${index}`} />
                    <label
                      htmlFor={`mustHaveQualification${index}`}
                      style={{ marginLeft: 4 }}
                    >
                      Must-have qualification
                    </label>
                  </Box>
                )}
              />
            </Box>
          </Box>
        ))}
        <Button
          variant="text"
          sx={{color: 'black',  }}
          onClick={() =>
            append({
              question: "",
              responseType: "",
              idealAnswer: "",
              mustHaveQualification: false,
            })
          }
        >
          + Add Question
        </Button>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3,
        pt:3, borderTop: '1px solid rgb(236, 236, 236)'}}>
          <Button variant="outlined"
          sx={{
            width: "25%",
            borderRadius: "10px",
            color: "black",
            borderColor: "black",}} 
            onClick={() => {}}>
            Previous
          </Button>
          <Button variant="contained" type="submit" sx={{backgroundColor: "#0060D1",
              color: "white",
              width: "25%",
              borderRadius: "10px",
              textTransform: "none",}}>
            Next
          </Button>
        </Box>
      </Box>

      {/* Modal for Preview */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="job-preview-title"
        aria-describedby="job-preview-description"
      >
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography id="job-preview-title" variant="h6" component="h2">
            Job Preview
          </Typography>
          <Typography id="job-preview-description" sx={{ mt: 2 }}>
            {formData.questions?.map((q, index) => (
              <div key={index}>
                <strong>Question {index + 1}:</strong> {q.question}
                <br />
                <strong>Response Type:</strong> {q.responseType}
                <br />
                <strong>Ideal Answer:</strong> {q.idealAnswer}
                <br />
                <strong>Must-have qualification:</strong>{" "}
                {q.mustHaveQualification ? "Yes" : "No"}
                <br />
                <br />
              </div>
            ))}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button onClick={() => setModalOpen(false)} variant="contained">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleNextStep)}
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 3,
  p: 4,
  color: "#000",
};

export default StepTwo;
