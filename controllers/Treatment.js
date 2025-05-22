//models
import Treatment from '../models/treatment.js';

export const getAllTreatments = async (req, res, next) => {
  const { dentistId, patientId } = req.sanitizedBody || req.body;
  if (!['dev', 'prod'].includes(process.env.NODE_ENV)) {
    req.user = {
      role: 'dentist',
      _id: '67f1c48d6a203d62e0ad7786',
    };
  }
  const { role, _id } = req.user;
  try {
    const query =
      role === 'dentist'
        ? { dentist: _id, patient: patientId }
        : role === 'patient'
          ? { patient: _id }
          : { dentist: dentistId, patient: patientId };
    
    const treatments = await Treatment.find(query)
      .populate('patient', '-password')
      .populate('dentist', '-password');
    console.log("treatment: ", treatments);
    if (treatments.length == 0)
      return res
        .status(404)
        .json({ err: 'No Treatments found for this patient!' });

    return res.status(200).json({ treatments });
  } catch (err) {
    next(err);
  }
};

export const AddTreatment = async (req, res, next) => {
  const { name, description, startDate, endDate, patientId } =
    req.sanitizedBody || req.body;

  try {
    const treatment = await Treatment.create({
      name,
      description,
      startDate,
      endDate,
      dentist: req.user._id,
      patient: patientId,
    });

    return res.status(201).json({ message: 'treatment added', treatment });
  } catch (err) {
    next(err);
  }
};
