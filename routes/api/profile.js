const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route    GET api/profile/me
// @desc     get current users profile
// @access   private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar", "password"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create and update users profile
// @access   private
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build  profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Build social objects
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }

  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   public

router.get('/', async(req, res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
// @access   public

router.get('/user/:user_id', async(req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
           return res.status(400).json({msg: "There is no profile for this user"});
        }
        res.json(profile);
    } catch (error) {
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: "There is no profile for this user"});
        }
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

// @route    DELETE api/profile
// @desc     delete profile, user and post
// @access   private
router.delete('/', auth, async(req, res)=>{
    try {
        // Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        // Remove User
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg: "User deleted"})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

// @route    PUT api/profile/experience
// @desc     add experience to profile
// @access   private
router.put(
  "/experience",
  [
    auth,
    [
      check("titles", "Title is required").notEmpty(),
      check("company", "company is required").notEmpty(),
      check("from", "from date is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {titles, company, location, from , to, current, description} = req.body;

    const newExp = {
        titles, company, location, from, to, current, description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experiences.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }

  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     delete experience of profile
// @access   private
router.delete('/experience/:exp_id', auth, async(req, res)=>{
    try {
        
        const profile = await Profile.findOne({user: req.user.id});

        //Get remove index
        const removeIndex = profile.experiences.map(item => item.id).indexOf(req.params.exp_id);

        profile.experiences.splice(removeIndex);

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

// @route    PUT api/profile/education
// @desc     add education to profile
// @access   private
router.put(
    "/education",
    [
      auth,
      [
        check("school", "school is required").notEmpty(),
        check("degree", "degree is required").notEmpty(),
        check("fieldofstudy", "fieldofstudy is required").notEmpty(),
        check("from", "from date is required").notEmpty(),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {school, degree, fieldofstudy, from , to, current, description} = req.body;
  
      const newEdu = {
        school, degree, fieldofstudy, from, to, current, description
      }
  
      try {
          const profile = await Profile.findOne({ user: req.user.id });
  
          profile.education.unshift(newEdu);
    
          await profile.save();
    
          res.json(profile);
  
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
  
    }
  );
  
  // @route    DELETE api/profile/education/:exp_id
  // @desc     delete education of profile
  // @access   private
  router.delete('/education/:edu_id', auth, async(req, res)=>{
      try {
          
          const profile = await Profile.findOne({user: req.user.id});
  
          //Get remove index
          const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
  
          profile.education.splice(removeIndex);
  
          await profile.save();
          res.json(profile);
      } catch (error) {
          console.error(error.message);
          res.status(500).send("Server Error");
      }
  })


module.exports = router;
