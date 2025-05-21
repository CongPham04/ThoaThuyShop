package com.devteria.identify_service.repository;
import com.devteria.identify_service.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface CollectionRepository extends JpaRepository<Collection, Long> {

}
