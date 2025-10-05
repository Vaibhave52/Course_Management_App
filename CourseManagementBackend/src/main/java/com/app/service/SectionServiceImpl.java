package com.app.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.SectionDao;
import com.app.dao.SubjectDao;
import com.app.dto.SectionReqDto;
import com.app.dto.SectionRespDto;
import com.app.entity.Section;
import com.app.entity.Subject;

@Service
@Transactional
public class SectionServiceImpl implements SectionService {

	@Autowired
	private SectionDao sectionDao;

	@Autowired
	private SubjectDao subjectDao;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public List<SectionRespDto> getAllSection(int subId) {

		List<Section> list = sectionDao.findAllBySubjectId(subId);

		return list.stream().map(section -> {
			SectionRespDto map = modelMapper.map(section, SectionRespDto.class);
			map.setSubjectName(section.getSubject().getName());
			return map;
		}).toList();
	}

	@Override
	public SectionRespDto addNewSection(SectionReqDto srd) {
		Subject subject = subjectDao.findById(srd.getSubjectId())
				.orElseThrow(() -> new RuntimeException("Subject not found with id " + srd.getSubjectId()));

		Section section = Section.builder().sectionName(srd.getSectionName()).subject(subject).build();

		Section save = sectionDao.save(section);

		SectionRespDto map = modelMapper.map(save, SectionRespDto.class);
		map.setSubjectName(save.getSubject().getName());

		return map;
	}

	@Override
	public SectionRespDto updateSection(int subId, SectionReqDto srd) {

		Section section = sectionDao.findById(subId)
				.orElseThrow(() -> new RuntimeException("section not found by id " + subId));

		section.setSectionName(srd.getSectionName());

		if (!section.getSubject().getId().equals(srd.getSubjectId())) {
			Subject subject = subjectDao.findById(srd.getSubjectId())
					.orElseThrow(() -> new RuntimeException("Subject not found"));
			section.setSubject(subject);
		}

		Section save = sectionDao.save(section);

		SectionRespDto map = modelMapper.map(save, SectionRespDto.class);
		map.setSubjectName(save.getSubject().getName());

		return map;
	}

	@Override
	public String deleteSection(int secId) {
		Section section = sectionDao.findById(secId).orElseThrow(() -> new RuntimeException("section not found"));

		sectionDao.delete(section);

		return "Deleted Successfully";
	}

}
