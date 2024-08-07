import React, { useState } from "react";
import { TextField, MenuItem, Box, Button, Modal, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_JOB, GET_ALL_JOB_CATEGORY } from "@/app/(queries)/queries";
import { parseCookies } from "nookies";


const stepOneSchema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  workspaceType: z.string().min(1, "Workspace Type is required"),
  jobLocation: z.string().min(1, "Job Location is required"),
  jobCategory: z.string().min(1, "Job Category is required"),
  employmentType: z.string().min(1, "Employment Type is required"),
  seniorityLevel: z.string().min(1, "Seniority Level is required"),
  postingDate: z.string().optional(),
  endingDate: z.string().optional(),
  jobDescription: z.string().min(1, "Job Description is required"),
});

const StepOne = ({ handleNext }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepOneSchema),
  });

  const onSubmit = (data) => {
    setFormData(data);
    setModalOpen(true); // Open modal to show preview
  };

  const handleNextStep = async (data) => {
    try {
        const { employmentType, jobDescription, jobLocation, jobTitle, seniorityLevel, startDate,
            endDate, workspaceType, jobCategory } = data;
        const response = await createJob({
          variables: {
            data: {
              employmentType,
              jobDescription,
              jobLocation,
              jobTitle,
              seniorityLevel,
              startDate,
              endDate,
              workspaceType,
              categoryId: jobCategory
            },
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        const jobId = response.data.createJob._id; // Accessing the _id from the response
        const params = new URLSearchParams({ jobId });

        // Update the URL with the new query parameters
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    

        handleNext(formData);
        } catch (error) {
        console.error("Error Creating Job:", error);
      }
  };
  const [createJob] = useMutation(CREATE_JOB);
  const cookies = parseCookies();
  const token = cookies.accessToken;
  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);



  const [categories, setCategories] = useState([]);

  const { data: categoryData, loading: categoryLoading, fetchMore: categoryFetchMore } = useQuery(GET_ALL_JOB_CATEGORY, {
    variables: { limit: 10, sort: { categoryName: 1 } },
    onCompleted: (categoryData) => {
      setCategories(categoryData.getAllJobCategory);
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  });

  const handleScroll = (e, fetchMoreFunction, items, setItems, itemKey) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      fetchMoreFunction({
        variables: { offset: items.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          const updatedItems = [...previousResult[itemKey], ...fetchMoreResult[itemKey]];
          setItems(updatedItems);
          return { ...previousResult, [itemKey]: updatedItems };
        },
      });
    }
  };

  const handleScrollCategory = (e) => handleScroll(e, categoryFetchMore, categories, setCategories, 'getAllJobCategory');

  return (
    <>
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
    <Typography variant="h5" sx={{fontWeight: 'bold', my: 3}}>
            What job do you want to post?
          </Typography>

      <TextField
      sx={{mb:2}}
        id="jobTitle"
        label="Job Title"
        required
        fullWidth
        margin="normal"
        {...register("jobTitle")}
        error={!!errors.jobTitle}
        helperText={errors.jobTitle?.message}
      />
      <Box sx={{display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,}}>
      <TextField
      sx={{width: "48%"}}
        id="workspaceType"
        label="Workspace Type"
        required
        fullWidth
        select
        margin="normal"
        {...register("workspaceType")}
        error={!!errors.workspaceType}
        helperText={errors.workspaceType?.message}
      >
        <MenuItem value="HYBRID">Hybrid</MenuItem>
        <MenuItem value="REMOTE">Remote</MenuItem>
        <MenuItem value="ONSITE">On-site</MenuItem>
      </TextField>
      <TextField
      sx={{width: "48%"}}
        id="jobLocation"
        label="Job Location"
        required
        fullWidth
        margin="normal"
        {...register("jobLocation")}
        error={!!errors.jobLocation}
        helperText={errors.jobLocation?.message}
      />
      </Box>
      <Box sx={{display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,}}>

      <TextField
            sx={{width: "31%"}}

        id="jobCategory"
        label="Job Category"
        required
        fullWidth
        select
        margin="normal"
        {...register("jobCategory")}
        onScroll={handleScrollCategory}
        error={!!errors.jobCategory}
        helperText={errors.jobCategory?.message}
        SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: '330px', // Approximately 9 items
                  overflowY: 'auto',
                },
                onScroll: handleScrollCategory,
              },
            },
          }}
      >
        <MenuItem value="">Select a category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
      </TextField>
      <TextField
                  sx={{width: "31%"}}

        id="employmentType"
        label="Employment Type"
        required
        fullWidth
        select
        margin="normal"
        {...register("employmentType")}
        error={!!errors.employmentType}
        helperText={errors.employmentType?.message}
      >
        {/* Add menu items */}
        <MenuItem value="FULL_TIME">Full Time</MenuItem>
        <MenuItem value="PART_TIME">Part Time</MenuItem>
        <MenuItem value="CONTRACT">Contract</MenuItem>
        <MenuItem value="INTERN">Intern</MenuItem>

      </TextField>
      <TextField
                  sx={{width: "31%"}}

        id="seniorityLevel"
        label="Seniority Level"
        required
        fullWidth
        select
        margin="normal"
        {...register("seniorityLevel")}
        error={!!errors.seniorityLevel}
        helperText={errors.seniorityLevel?.message}
      >
        {/* Add menu items */}
        <MenuItem value="JUNIOR_LEVEL">Junior Level</MenuItem>
        <MenuItem value="MID_LEVEL">Mid Level</MenuItem>
        <MenuItem value="SENIOR_LEVEL">Senior Level</MenuItem>
      </TextField>
      </Box>
      <Box sx={{display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                mb: 2,}}>

      <TextField
            sx={{width: "48%"}}

        id="postingDate"
        label="Posting Date"
        fullWidth
        margin="normal"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register("postingDate")}
        error={!!errors.postingDate}
        helperText={errors.postingDate?.message}
      />
      <TextField
            sx={{width: "48%"}}

        id="endingDate"
        label="Ending Date"
        fullWidth
        margin="normal"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register("endingDate")}
        error={!!errors.endingDate}
        helperText={errors.endingDate?.message}
      />
      </Box>
      <TextField
      sx={{pb:3, borderBottom: '1px solid rgb(236, 236, 236)' }}
        id="jobDescription"
        label="Job Description"
        required
        fullWidth
        margin="normal"
        multiline
        rows={4}
        variant="outlined"
        {...register("jobDescription")}
        error={!!errors.jobDescription}
        helperText={errors.jobDescription?.message}
      />
      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
      <Button type="submit" variant="contained" sx={{
              backgroundColor: "#0060D1",
              color: "white",
              width: "25%",
              borderRadius: "10px",
              textTransform: "none",}}>
        Next
      </Button>
      </Box>
    </Box>
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
            <strong>Job Title:</strong> {formData.jobTitle}<br />
            <strong>Workspace Type:</strong> {formData.workspaceType}<br />
            <strong>Job Location:</strong> {formData.jobLocation}<br />
            <strong>Job Category:</strong> {formData.jobCategory}<br />
            <strong>Employment Type:</strong> {formData.employmentType}<br />
            <strong>Seniority Level:</strong> {formData.seniorityLevel}<br />
            <strong>Posting Date:</strong> {formData.postingDate}<br />
            <strong>Ending Date:</strong> {formData.endingDate}<br />
            <strong>Job Description:</strong> {formData.jobDescription}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Button onClick={() => setModalOpen(false)} variant="contained">Cancel</Button>
            <Button onClick={handleSubmit(handleNextStep)} variant="contained" color="primary">Next</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 3,
    p: 4,
    color: '#000',
  };
  

export default StepOne;
